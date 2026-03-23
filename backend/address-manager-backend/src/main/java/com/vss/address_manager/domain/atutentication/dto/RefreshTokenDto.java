package com.vss.address_manager.domain.atutentication.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenDto(
        @NotBlank(message="Token não pode ser vazio")
        String refreshToken
) {
}
