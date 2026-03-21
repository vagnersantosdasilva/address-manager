package com.vss.address_manager.domain.user;

import com.vss.address_manager.domain.address.Address;
import com.vss.address_manager.domain.user.dto.UserCreateDto;
import com.vss.address_manager.domain.user.dto.UserUpdateDto;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name="user")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate birthDate;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
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
        this.userType = user.userType();
    }

    public User(){}


    @Override
    public String getPassword(){
        return this.password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convertendo o seu UserType em uma Authority do Spring
        if (this.userType == UserType.ADMIN) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_COMMON"));
    }

    @Override
    public String getUsername() {
        return this.cpf;
    }
}
