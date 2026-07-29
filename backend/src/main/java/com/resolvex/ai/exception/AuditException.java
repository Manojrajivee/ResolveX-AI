package com.resolvex.ai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AuditException extends RuntimeException {

    public AuditException(String message) {
        super(message);
    }
}
