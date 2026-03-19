package com.vss.address_manager.infra.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class ErroHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity handleBusinessException(ResourceNotFoundException e){
        return ResponseEntity.badRequest().body(new DadosErros(e.getMessage()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity handleBusinessException(BusinessException e){
        return ResponseEntity.badRequest().body(new DadosErros(e.getMessage()));
    }

    // 2. Trata erros do @Valid (ex: campo vazio, formato inválido)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleValidationError(MethodArgumentNotValidException ex) {
        // Converte a lista de FieldErrors para o seu record DadosErroValidacao
        List<DadosErroValidacao> erros = ex.getFieldErrors()
                .stream()
                .map(DadosErroValidacao::new)
                .toList();

        return ResponseEntity.badRequest().body(erros);
    }

    // Records para estruturar o JSON de resposta
    private record DadosErroValidacao(String field, String message) {
        public DadosErroValidacao(FieldError erro) {
            this(erro.getField(), erro.getDefaultMessage());
        }
    }

    private record DadosErros(String message){}
}