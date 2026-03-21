package com.vss.address_manager.domain.atutentication.dto;

public record TokenDto(
        String accessToken,
        String refreshToken)
{
}
