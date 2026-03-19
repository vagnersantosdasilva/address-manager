package com.vss.address_manager.domain.user;

import com.vss.address_manager.domain.user.dto.UserCreateDto;
import com.vss.address_manager.domain.user.dto.UserResponseDto;
import com.vss.address_manager.domain.user.dto.UserUpdateDto;
import com.vss.address_manager.infra.exceptions.BusinessException;
import com.vss.address_manager.infra.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private UserRepository userRepository;

    @Autowired
    UserService(UserRepository userRepository ){
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponseDto createUser(UserCreateDto userDto) {
        Optional<User> userOptional = this.userRepository.findByCpf(userDto.cpf());
        if (userOptional.isEmpty()){
            User userSaved =  this.userRepository.save(new User(userDto));
            return new UserResponseDto(userSaved);
        }
        throw new BusinessException("CPF já cadastrado!");
    }

    @Transactional
    public UserResponseDto updateUser(UserUpdateDto userDto, Long idUser){
        Optional<User> userOptional = this.userRepository.findById(idUser);
        if (userOptional.isPresent()){
            User user = userOptional.get();
            user.setUserType(userDto.userType());
            user.setCpf(userDto.cpf());
            user.setBirthDate(userDto.birthDate());
            User userSaved =  this.userRepository.save(user);
            return new UserResponseDto(userSaved);
        }
        throw new ResourceNotFoundException("Usuário não encontrado!");
    }

    @Transactional
    public void deleteUser(Long idUser){
        Optional<User> userOptional = this.userRepository.findById(idUser);
        if (userOptional.isEmpty()){
            throw new ResourceNotFoundException("Usuário não encontrado!");
        }
        this.userRepository.delete(userOptional.get());
    }

    public List<UserResponseDto> getAllUser() {
        return this.userRepository
                .findAll()
                .stream()
                .map(e->new UserResponseDto(e))
                .collect(Collectors.toList());
    }

    public UserResponseDto getUserByCPF(String cpf){
        Optional userOptional = this.userRepository.findByCpf(cpf);
        if (userOptional.isPresent()){
            return new UserResponseDto((User)userOptional.get());
        }
        throw new ResourceNotFoundException("Usuário não encontrado pelo cpf");
    }

    public UserResponseDto getUserByCPF(Long id){
        Optional userOptional = this.userRepository.findById(id);
        if (userOptional.isPresent()){
            return new UserResponseDto((User)userOptional.get());
        }
        throw new ResourceNotFoundException("Usuário não encontrado pelo Id");
    }
}
