package com.resolvex.ai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class ReportException extends RuntimeException {

    public ReportException(String message) {
        super(message);
    }
}
