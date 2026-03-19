package com.vss.address_manager.domain.user;


import com.vss.address_manager.domain.user.dto.UserCreateDto;
import com.vss.address_manager.domain.user.dto.UserUpdateDto;
import com.vss.address_manager.infra.exceptions.BusinessException;
import com.vss.address_manager.infra.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    /*CreateUser*/
    @Test
    @DisplayName("Deve criar um usuário com sucesso")
    void shouldCreateUserSuccessfully() {
        // Arrange (Configuração)
        UserCreateDto dto = new UserCreateDto(
                "João Silva",
                "12345678901",
                LocalDate.of(1990, 1, 1),
                "senha123",
                UserType.COMMON
        );

        // Simula que o CPF não existe no banco
        // Ajuste: Retorna um Optional vazio para indicar que o CPF está livre
        when(userRepository.findByCpf(dto.cpf())).thenReturn(Optional.empty());

        // AJUSTE AQUI: Configura o mock para retornar o usuário que for salvo
        // Usamos thenAnswer para simular que o banco de dados gerou um ID
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User userToSave = invocation.getArgument(0);
            userToSave.setId(1L); // Simula o ID gerado pelo banco
            return userToSave;
        });

        // Act (Execução)
        userService.createUser(dto);

        // Assert (Verificação)
        // Verifica se o método save foi chamado uma vez
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando CPF já existir")
    void shouldThrowExceptionWhenCpfExists() {
        // Arrange
        UserCreateDto dto = new UserCreateDto("Nome", "123", LocalDate.now(), "123", UserType.ADMIN);
        User existingUser = new User(dto); //simular o que já existe

        // Retorna um Optional preenchido com o usuário existente
        when(userRepository.findByCpf("123")).thenReturn(Optional.of(existingUser));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(dto);
        });

        assertEquals("CPF já cadastrado!", exception.getMessage());

        verify(userRepository, never()).save(any());
    }

    /*UpdateUser*/
    @Test
    @DisplayName("Deve lançar exceção quando Usuario não existe")
    void shouldThrowExceptionWhenUserNotExists() {
        // Arrange
        UserUpdateDto dto = new UserUpdateDto(1L,"Nome", "123", LocalDate.now(), "123", UserType.ADMIN);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(dto,1L);
        });
        assertEquals("Usuário não encontrado!", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve atualizar usuario quando usuario existir")
    void shouldUpdatedUserWhenUserExists() {
        // Arrange
        Long userId = 1L;
        UserUpdateDto dto = new UserUpdateDto(
                userId,
                "Nome Atualizado",
                "12345678901",
                LocalDate.of(1995, 5, 5),
                "novaSenha123",
                UserType.ADMIN
        );

        // Usuário que "está" no banco de dados antes da atualização
        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setName("Nome Antigo");
        existingUser.setCpf("12345678901");
        existingUser.setBirthDate(LocalDate.of(1995, 5, 5));
        existingUser.setUserType(UserType.ADMIN);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        // Simula o retorno do save (importante para não dar NullPointer no ResponseDto se o service o retornar)
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        userService.updateUser(dto, userId);

        // Assert
        verify(userRepository, times(1)).findById(userId);

        verify(userRepository, times(1)).save(any(User.class));
    }


    /* DeleteUser */
    @Test
    @DisplayName("Deve remover um usuario quando ele existir")
    void shouldDeleteUserWhenUserExistis(){
        // Arrange
        Long userId = 1L;
        UserUpdateDto dto = new UserUpdateDto(
                userId,
                "Nome",
                "12345678901",
                LocalDate.of(1995, 5, 5),
                "novaSenha123",
                UserType.ADMIN
        );

        User user = new User(dto);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        userService.deleteUser(userId);

        // Assert
        verify(userRepository, times(1)).findById(userId);

        verify(userRepository, times(1)).delete(any(User.class));

    }

    @Test
    @DisplayName("Deveria lançar exception se usuario não encontrado!")
    void shouldThrowExceptionWhenUserDeleteNotExists(){
        Long userDeleteId = 1L;
        when(userRepository.findById(userDeleteId)).thenReturn(Optional.empty());
        //act
        //userService.deleteUser(1L);
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            userService.deleteUser(1L);
        });
        assertEquals("Usuário não encontrado!", exception.getMessage());
        verify(userRepository, never()).delete(any());
    }


}
