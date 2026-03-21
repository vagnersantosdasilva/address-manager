package com.vss.address_manager.infra.extenal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ZipCodeResponseDto(

        @JsonProperty("zipCode")
        String cep,

        @JsonProperty("logradouro")
        String street,

        @JsonProperty("complemento")
        String complement,

        @JsonProperty("bairro")
        String neighborhood,

        @JsonProperty("localidade")
        String city,

        @JsonProperty("uf")
        String state,
        // Adicione este campo para verificar se o CEP não foi encontrado
        Boolean erro
) {
    // Um método utilitário para validar a resposta
    public boolean isInvalid() {
        return erro != null && erro;
    }
}
