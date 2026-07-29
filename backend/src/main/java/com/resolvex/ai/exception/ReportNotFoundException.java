package com.resolvex.ai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ReportNotFoundException extends ReportException {

    public ReportNotFoundException(String message) {
        super(message);
    }
}
