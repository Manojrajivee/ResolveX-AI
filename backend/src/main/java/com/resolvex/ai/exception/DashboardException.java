package com.resolvex.ai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DashboardException extends RuntimeException {

    public DashboardException(String message) {
        super(message);
    }
}
