package com.vss.address_manager.domain.address.dto;

public record AddressPartialDto(
        String zipCode,
        String street,
        String complement,
        String neighborhood,
        String city,
        String state
) {
}
