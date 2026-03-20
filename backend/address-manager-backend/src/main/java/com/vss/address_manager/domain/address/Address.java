package com.vss.address_manager.domain.address;

import com.vss.address_manager.domain.address.dto.AddressCreateDto;
import com.vss.address_manager.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="cep", nullable = false, length = 9)
    private String zipCode; // CEP

    @Column(nullable = false)
    private String street; // Logradouro

    @Column(nullable = false)
    private Integer number;

    @Column(name = "supplement")
    private String complement;

    @Column(nullable = false)
    private String neighborhood; // Bairro

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

    @Column(name = "is_main", nullable = false)
    private Boolean isMain = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    public Address(AddressCreateDto dto, User user) {
        this.zipCode = dto.zipCode();
        this.street = dto.street();
        this.number = dto.number();
        this.complement = dto.complement();
        this.neighborhood = dto.neighborhood();
        this.city = dto.city();
        this.state = dto.state().toUpperCase(); // Padroniza para maiúsculas (ex: RJ)
        this.isMain = dto.isMain() != null ? dto.isMain() : false;
        this.user = user;
    }

    public Address(){}
}
