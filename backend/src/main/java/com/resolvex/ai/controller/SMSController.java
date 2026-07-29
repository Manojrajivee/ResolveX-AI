package com.resolvex.ai.controller;

import com.resolvex.ai.dto.SMSRequest;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.SMSService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sms")
public class SMSController {

    private final SMSService smsService;

    public SMSController(SMSService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendSMS(@Valid @RequestBody SMSRequest request) {
        smsService.sendSMS(request);
        return ResponseEntity.ok(ApiResponse.success("SMS sent successfully"));
    }
}
