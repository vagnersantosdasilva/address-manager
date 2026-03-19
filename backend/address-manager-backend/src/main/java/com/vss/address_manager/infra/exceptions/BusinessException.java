package com.vss.address_manager.infra.exceptions;


public class BusinessException extends RuntimeException{
    public BusinessException(String message) {
        super(message);
    }
}


