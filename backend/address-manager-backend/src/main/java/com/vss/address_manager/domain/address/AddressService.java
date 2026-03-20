package com.vss.address_manager.domain.address;

import com.vss.address_manager.domain.address.dto.AddressCreateDto;
import com.vss.address_manager.domain.address.dto.AddressResponseDto;
import com.vss.address_manager.domain.address.dto.AddressUpdateDto;
import com.vss.address_manager.domain.user.User;
import com.vss.address_manager.domain.user.UserRepository;
import com.vss.address_manager.infra.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


   /* • Ao informar um CEP válido, os campos de endereço devem ser preenchidos
    automaticamente utilizando a API ViaCEP.
    • O usuário deve poder cadastrar múltiplos endereços.
    • Cada usuário deve possuir apenas um endereço principal.
    • Caso um novo endereço seja definido como principal, o endereço principal anterior deve
    ser atualizado automaticamente.
    • Caso o endereço principal seja removido, outro endereço do usuário deve
    automaticamente se tornar o principal
    */

@Service
public class AddressService {

    private AddressRepository addressRepository;
    private UserRepository userRepository;

    @Autowired
    AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    //TODO: Garantir que usuário adm para criar endereço para o usuario
    @Transactional
    public AddressResponseDto createAddress(AddressCreateDto addressDto) {
        //TODO:Caso especial quando for primeiro endereço sempre vai ser principal
        Optional<User> userOptional = userRepository.findById(addressDto.userId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Optional<Address> mainAddress = addressRepository.findByUserIdAndIsMainTrue(user.getId());
            Address address = new Address(addressDto, user);
            if(addressDto.isMain() && mainAddress.isPresent()) {
                disablePreviousMainAddress(user.getId());
            }
            if (mainAddress.isEmpty()) address.setIsMain(true);
            return new AddressResponseDto(addressRepository.save(address));
        }
        throw new ResourceNotFoundException("Nenhum usuário associado ao endereço");
    }

    @Transactional
    public AddressResponseDto updateAddress(AddressUpdateDto addressDto, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado"));

        // TODO: Se este endereço está sendo definido como principal agora
        if (addressDto.isMain() && !address.getIsMain()) {
            disablePreviousMainAddress(address.getUser().getId());
            address.setIsMain(addressDto.isMain());
        }

        address.setZipCode(addressDto.zipCode());
        address.setStreet(addressDto.street());
        address.setNumber(addressDto.number());
        address.setComplement(addressDto.complement());
        address.setNeighborhood(addressDto.neighborhood());
        address.setCity(addressDto.city());
        address.setState(addressDto.state());
        return new AddressResponseDto(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long id) {

        Optional<Address> addressOptional = addressRepository.findById(id);

        if (addressOptional.isEmpty()){
            throw new ResourceNotFoundException("Endereço não encontrado");
        }
        Long userId = addressOptional.get().getUser().getId();
        boolean wasMain = addressOptional.get().getIsMain();
        addressRepository.delete(addressOptional.get());

        // Regra: Se deletamos o principal, precisamos promover outro
        if (wasMain) {
            promoteNewMainAddress(userId);
        }
    }

    public List<AddressResponseDto> getAddressByUserId(Long userId){
        return addressRepository.findByUserId(userId)
                .stream()
                .map(e-> new AddressResponseDto(e) )
                .collect(Collectors.toList());
    }

    private void promoteNewMainAddress(Long userId) {
        // TODO: Busca qualquer outro endereço desse usuário (o primeiro que vier)
        List<Address> otherAddresses = addressRepository.findByUserId(userId);

        if (!otherAddresses.isEmpty()) {
            Address newMain = otherAddresses.get(0);
            newMain.setIsMain(true);
            addressRepository.save(newMain);
        }
    }

    private void disablePreviousMainAddress(Long userId) {
        Optional<Address> addressOptional = addressRepository.findByUserIdAndIsMainTrue(userId);
        if (addressOptional.isPresent()) {
            Address addresMain = addressOptional.get();
            addresMain.setIsMain(false);
            addressRepository.save(addresMain);
        }
    }
}
