package com.vss.address_manager.domain.address;

import com.vss.address_manager.domain.address.dto.AddressPartialDto;
import com.vss.address_manager.domain.address.dto.AddressResponseDto;

public interface ZipCodeService {
    AddressPartialDto findAddressByZipCode(String zipCode);
}
