package com.vss.address_manager.domain.user.dto;

import com.vss.address_manager.domain.user.valid.CpfValid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserSelfUpdateDto (
        @NotBlank(message="Name não pode ser vazio")
        String name,
        @NotBlank(message = "cpf não pode ser vazio")
        @CpfValid(message="Formato de cpf inválido")
        String cpf,
        @NotNull(message = "Data de nascimento não pode ser vazio")
        LocalDate birthDate,
        @NotBlank
        @Size(min = 6, message="Password deve ter mínio de 6 caracteres")
        String password
){
}
