package com.vss.address_manager.infra.database;

import com.vss.address_manager.domain.user.User;
import com.vss.address_manager.domain.user.UserRepository;
import com.vss.address_manager.domain.user.UserType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitialize {
    // O valor padrão após os ":" (admin123) só será usado se a variável não for encontrada
    @Value("${api.security.admin.password:password}")
    private String adminPassword;

    @Value("${api.security.admin.cpf:00000000000}")
    private String adminCpf;

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setName("Admin Inicial");
                admin.setCpf(adminCpf);
                admin.setBirthDate(LocalDate.of(2000, 1, 1));
                admin.setUserType(UserType.ADMIN);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                userRepository.save(admin);
                System.out.println(">>> Admin criado com CPF: " + adminCpf);
            }
        };
    }
}
