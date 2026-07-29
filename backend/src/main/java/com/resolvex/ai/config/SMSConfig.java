package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SMSConfig {

    @Value("${app.sms.twilio-sid:}")
    private String accountSid;

    @Value("${app.sms.twilio-token:}")
    private String authToken;

    @Value("${app.sms.from-number:}")
    private String fromNumber;

    public String getAccountSid() {
        return accountSid;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String getFromNumber() {
        return fromNumber;
    }
}
