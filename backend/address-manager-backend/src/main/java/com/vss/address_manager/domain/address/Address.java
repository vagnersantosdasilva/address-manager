package com.vss.address_manager.domain.address;

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

    @Column(nullable = false, length = 9)
    private String zipCode; // CEP

    @Column(nullable = false)
    private String street; // Logradouro

    @Column(nullable = false)
    private Integer number;

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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
