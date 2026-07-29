package com.resolvex.ai.service;

import com.resolvex.ai.dto.SMSRequest;

public interface SMSService {
    
    void sendSMS(SMSRequest request);
}
