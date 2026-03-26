package com.vss.address_manager.domain.user.valid;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfValidator implements ConstraintValidator<CpfValid, String> {
    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        // SE FOR NULO, DEIXA PASSAR (O PATCH AGRADECE)
        if (cpf == null || cpf.isBlank()) {
            return true;
        }
        // Aqui você coloca a lógica de cálculo dos dígitos verificadores
        return validarCalculoCPF(cpf);
    }

    private boolean validarCalculoCPF(String cpf){
        if ((cpf !=null) && (cpf.length() == 11)) return true;
        return false;
    }
}