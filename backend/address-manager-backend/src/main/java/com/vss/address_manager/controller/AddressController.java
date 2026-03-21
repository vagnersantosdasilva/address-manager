package com.vss.address_manager.controller;

import com.vss.address_manager.domain.address.AddressService;
import com.vss.address_manager.domain.address.dto.AddressCreateDto;
import com.vss.address_manager.domain.address.dto.AddressResponseDto;
import com.vss.address_manager.domain.address.dto.AddressUpdateDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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


    @PostMapping("user/{idUser}/address")
    @PreAuthorize("hasRole('ROLE_ADMIN') or #idUser.equals(principal.id)")
    public ResponseEntity<AddressResponseDto> createAddress(@PathVariable Long idUser, @RequestBody @Valid AddressCreateDto addressCreateDto, UriComponentsBuilder uriBuilder) throws InterruptedException {
        AddressResponseDto addressResponseDto = addressService.createAddress(addressCreateDto);
        var uri = uriBuilder.path("/api/user/{idUser}/address/{id}")
                .buildAndExpand(idUser, addressResponseDto.id())
                .toUri();
        return ResponseEntity.created(uri).body(addressResponseDto);
    }

    @PutMapping("user/{idUser}/address/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or #idUser.equals(principal.id)")
    public ResponseEntity<AddressResponseDto> updateAddress(@PathVariable Long idUser, @RequestBody @Valid AddressUpdateDto addressUpdateDto, @PathVariable Long id){
        AddressResponseDto dataResponse = addressService.updateAddress(addressUpdateDto, id);
        return ResponseEntity.ok().body(dataResponse);
    }

    @DeleteMapping("user/{idUser}/address/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or #idUser.equals(principal.id)")
    public ResponseEntity deteUser(@PathVariable Long idUser, @PathVariable Long id){
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("user/{idUser}/address")
    @PreAuthorize("hasRole('ROLE_ADMIN') or #idUser.equals(principal.id)")
    public ResponseEntity<List<AddressResponseDto>> getAllByUser(@PathVariable Long idUser){
        return ResponseEntity.ok().body(addressService.getAddressByUserId(idUser));
    }

}
