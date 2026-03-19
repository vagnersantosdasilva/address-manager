package com.vss.address_manager.domain.user.dto;


import com.vss.address_manager.domain.user.UserType;
import com.vss.address_manager.domain.user.valid.CpfValid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UserUpdateDto(
        @NotNull(message = "Campo Id não pode ser vazio")
        Long id,
        @NotBlank(message="Campo Name não pode ser vazio")
        String name,
        @CpfValid(message="Campo CPF com formato inválido")
        @NotBlank(message="Campo CPF não pode ser vazio")
        String cpf,
        @NotNull(message="Campo Birth Date não pode ser vazio")
        LocalDate birthDate,
        @NotBlank(message="Campo Password não pode ser vazio")
        String password,
        @NotNull(message="Campo User Type não pode ser vazio")
        UserType userType // Use o Enum diretamente aqui!
) {
}