package com.resolvex.ai.service;

import com.resolvex.ai.config.SMSConfig;
import com.resolvex.ai.dto.SMSRequest;
import org.springframework.stereotype.Service;

@Service
public class SMSServiceImpl implements SMSService {

    private final SMSConfig smsConfig;

    public SMSServiceImpl(SMSConfig smsConfig) {
        this.smsConfig = smsConfig;
    }

    @Override
    public void sendSMS(SMSRequest request) {
        if (smsConfig.getAccountSid() == null || smsConfig.getAccountSid().isBlank()) {
            System.out.println("====== [OFFLINE MOCK TWILIO SMS] ======");
            System.out.println("To: " + request.getTo());
            System.out.println("Message: " + request.getMessage());
            System.out.println("=======================================");
            return;
        }

        System.out.println("Twilio Client: Dispatching SMS to " + request.getTo() + " fromTwilioNumber: " + smsConfig.getFromNumber());
    }
}
