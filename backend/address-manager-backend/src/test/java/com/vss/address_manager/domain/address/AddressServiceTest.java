package com.vss.address_manager.domain.address;

import com.vss.address_manager.domain.address.dto.AddressCreateDto;
import com.vss.address_manager.domain.user.User;
import com.vss.address_manager.domain.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AddressServiceTest {
    @Mock
    private AddressRepository addressRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AddressService addressService;

    @Test
    @DisplayName("Deve desativar endereço principal antigo ao criar um novo principal")
    void shouldDisableOldMainAddressWhenNewOneIsMain() {
        // 1. Arrange
        Long userId = 1L;
        AddressCreateDto dto = new AddressCreateDto(
                "12345-678", "Rua Nova", 100, null, "Bairro", "Cidade", "RJ", true, userId
        );

        User user = new User();
        user.setId(userId);

        Address oldMainAddress = new Address();
        oldMainAddress.setId(50L);
        oldMainAddress.setIsMain(true);
        oldMainAddress.setUser(user);

        // Configura as respostas dos Mocks
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        // Simula que achou um endereço principal antigo para esse usuário
        when(addressRepository.findByUserIdAndIsMainTrue(userId)).thenReturn(Optional.of(oldMainAddress));
        // Simula o save do novo endereço
        when(addressRepository.save(any(Address.class))).thenAnswer(i -> i.getArgument(0));

        // 2. Act
        addressService.createAddress(dto);

        // 3. Assert
        // Verifica se o endereço antigo foi desativado
        assertFalse(oldMainAddress.getIsMain());

        // Verifica se o save foi chamado 2 vezes, para o antigo (desativando) e para o novo (criando)
        Mockito.verify(addressRepository, times(2)).save(any(Address.class));

        // Garante que buscou o principal anterior
        Mockito.verify(addressRepository).findByUserIdAndIsMainTrue(userId);
    }

    @Test
    @DisplayName("Deve promover outro endereço a principal quando o atual for deletado")
    void shouldPromoteNewMainWhenCurrentIsDeleted() {
        // Arrange
        Long addressId = 10L;
        Long userId = 1L;

        User user = new User();
        user.setId(userId);

        Address addressToDelete = new Address();
        addressToDelete.setId(addressId);
        addressToDelete.setIsMain(true); // Era o principal
        addressToDelete.setUser(user);

        Address remainingAddress = new Address();
        remainingAddress.setId(11L);
        remainingAddress.setIsMain(false);
        remainingAddress.setUser(user);

        when(addressRepository.findById(addressId)).thenReturn(Optional.of(addressToDelete));
        when(addressRepository.findByUserId(userId)).thenReturn(List.of(remainingAddress));

        // Act
        addressService.deleteAddress(addressId);

        //TODO: Assert verifica se delete e save foram chamados,
        //TODO: verificar se 'o outro' foi promovido
        Mockito.verify(addressRepository).delete(addressToDelete);
        assertTrue(remainingAddress.getIsMain()); // O outro foi promovido!
        Mockito.verify(addressRepository).save(remainingAddress);
    }
}
