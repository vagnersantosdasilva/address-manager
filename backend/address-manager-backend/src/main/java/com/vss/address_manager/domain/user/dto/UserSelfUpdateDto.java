package com.vss.address_manager.domain.user.dto;

import com.vss.address_manager.domain.user.valid.CpfValid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserSelfUpdateDto (
        String name,
        @CpfValid
        String cpf,
        LocalDate birthDate,
        @Size(min = 6)
        String password
){}
