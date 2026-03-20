package com.vss.address_manager.domain.address.dto;

import com.vss.address_manager.domain.address.Address;

public record AddressResponseDto(Long id,
                                 String zipCode,
                                 String street,
                                 Integer number,
                                 String complement,
                                 String neighborhood,
                                 String city,
                                 String state,
                                 Boolean isMain,
                                 Long userId // Retornamos apenas o ID do dono para simplificar o JSON
) {
    // Construtor que converte a Entidade Address para o DTO
    public AddressResponseDto(Address address) {
        this(
                address.getId(),
                address.getZipCode(),
                address.getStreet(),
                address.getNumber(),
                address.getComplement(),
                address.getNeighborhood(),
                address.getCity(),
                address.getState(),
                address.getIsMain(),
                address.getUser() != null ? address.getUser().getId() : null
        );
    }
}