package com.resolvex.ai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PushNotificationException extends RuntimeException {

    public PushNotificationException(String message) {
        super(message);
    }
}
