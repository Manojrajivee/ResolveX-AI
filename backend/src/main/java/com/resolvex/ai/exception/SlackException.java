package com.resolvex.ai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SlackException extends RuntimeException {

    public SlackException(String message) {
        super(message);
    }
}
