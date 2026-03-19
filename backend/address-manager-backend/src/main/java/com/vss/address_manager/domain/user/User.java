package com.vss.address_manager.domain.user;

import com.vss.address_manager.domain.address.Address;
import com.vss.address_manager.domain.user.dto.UserCreateDto;
import com.vss.address_manager.domain.user.dto.UserUpdateDto;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name="user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    public User(UserCreateDto user) {
        this.name = user.name();
        this.cpf = user.cpf();
        this.birthDate = user.birthDate();
        this.password = user.password();
        this.userType = user.userType();
    }

    public User(UserUpdateDto user) {
        this.id = user.id();
        this.name = user.name();
        this.cpf = user.cpf();
        this.birthDate = user.birthDate();
        this.password = user.password();
        this.userType = user.userType();
    }

    public User(){}
}
