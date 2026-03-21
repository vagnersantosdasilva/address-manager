package com.vss.address_manager.domain.atutentication.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDto(
        @NotBlank(message = "CPF não poder ser vazio")
        String cpf,
        @NotBlank(message = "Password não pode ser vazio")
        String password
) {
}
