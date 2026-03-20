package com.vss.address_manager.controller;

import com.vss.address_manager.domain.address.AddressService;
import com.vss.address_manager.domain.address.dto.AddressCreateDto;
import com.vss.address_manager.domain.address.dto.AddressResponseDto;
import com.vss.address_manager.domain.address.dto.AddressUpdateDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AddressController {

    private AddressService addressService;

    @Autowired
    AddressController(AddressService addressService){
        this.addressService = addressService;
    }


    @PostMapping("address")
    public ResponseEntity<AddressResponseDto> createAddress(@RequestBody @Valid AddressCreateDto addressCreateDto, UriComponentsBuilder uriBuilder) throws InterruptedException {
        AddressResponseDto addressResponseDto = addressService.createAddress(addressCreateDto);
        var uri = uriBuilder.path("/user/{id}").buildAndExpand(addressResponseDto.id()).toUri();
        return ResponseEntity.created(uri).body(addressResponseDto);
    }

    @PutMapping("address/{id}")
    public ResponseEntity<AddressResponseDto> updateAddress(@RequestBody @Valid AddressUpdateDto addressUpdateDto, @PathVariable Long id){
        AddressResponseDto dataResponse = addressService.updateAddress(addressUpdateDto, id);
        return ResponseEntity.ok().body(dataResponse);
    }

    @DeleteMapping("address/{id}")
    public ResponseEntity deteUser(@PathVariable Long id){
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("user/{id}/address")
    public ResponseEntity<List<AddressResponseDto>> getAllByUser(@PathVariable Long id){
        return ResponseEntity.ok().body(addressService.getAddressByUserId(id));
    }

}
