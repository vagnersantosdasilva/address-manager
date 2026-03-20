package com.vss.address_manager.domain.address.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressUpdateDto(

        @NotNull(message = "O ID não pode ser vazio")
        Long id,

        @NotBlank(message = "O CEP é obrigatório")
        @Pattern(regexp = "\\d{8}", message = "CEP em formato inválido (Ex: 00000000)")
        String zipCode,

        @NotBlank(message = "O logradouro é obrigatório")
        String street,

        @NotNull(message = "O número é obrigatório")
        Integer number,

        String complement,

        @NotBlank(message = "O bairro é obrigatório")
        String neighborhood,

        @NotBlank(message = "A cidade é obrigatória")
        String city,

        @NotBlank(message = "O estado (UF) é obrigatório")
        @Size(min = 2, max = 2, message = "O estado deve conter exatamente 2 caracteres (UF)")
        String state,

        @NotNull(message = "Deve informar se este é o endereço principal")
        Boolean isMain,

        @NotNull(message = "O ID do usuário é obrigatório para vincular o endereço")
        Long userId
) {
}
