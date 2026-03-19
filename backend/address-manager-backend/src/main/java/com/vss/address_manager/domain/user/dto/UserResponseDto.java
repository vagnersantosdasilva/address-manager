package com.vss.address_manager.domain.user.dto;

import com.vss.address_manager.domain.user.User;
import com.vss.address_manager.domain.user.UserType;

import java.time.LocalDate;

public record UserResponseDto(
        Long id,
        String name,
        String cpf,
        LocalDate birthDate,
        UserType userType
) {
    public UserResponseDto(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getCpf(),
                user.getBirthDate(),
                user.getUserType()
        );
    }
}
