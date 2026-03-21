package com.vss.address_manager.infra.extenal;

import com.vss.address_manager.domain.address.ZipCodeService;
import com.vss.address_manager.domain.address.dto.AddressPartialDto;
import com.vss.address_manager.infra.exceptions.BusinessException;
import com.vss.address_manager.infra.extenal.dto.ZipCodeResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


@Service
public class ZipCodeServiceImpl implements ZipCodeService {

    RestTemplate restTemplate;

    ZipCodeServiceImpl(RestTemplate restTemplate){
        this.restTemplate = restTemplate;
    }

    @Value("${api.external.zipcode.url}")
    private String baseUrl;

    @Override
    public AddressPartialDto findAddressByZipCode(String zipCode) {
        // Monta a URL: https://viacep.com.br/ws/{cep}/json/
        String url = UriComponentsBuilder.fromUriString(baseUrl)
                .path("{zipCode}/json/")
                .buildAndExpand(zipCode)
                .toUriString();

        //String url = "https://viacep.com.br/ws/" + zipCode + "/json/";
        try {
            ZipCodeResponseDto response =  restTemplate.getForObject(url, ZipCodeResponseDto.class);
            return new AddressPartialDto(
                    zipCode,
                    response.street(),
                    response.complement(),
                    response.neighborhood(),
                    response.city(),
                    response.state()
            );
        } catch (Exception e) {
            throw new BusinessException("Erro ao consultar CEP externo");
        }
    }
}
