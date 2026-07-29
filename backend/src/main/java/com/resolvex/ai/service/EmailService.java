package com.resolvex.ai.service;

import com.resolvex.ai.dto.EmailRequest;

public interface EmailService {
    
    void sendEmail(EmailRequest request);
}
