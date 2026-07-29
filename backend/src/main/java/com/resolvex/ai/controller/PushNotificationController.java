package com.resolvex.ai.controller;

import com.resolvex.ai.dto.PushNotificationRequest;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.PushNotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/push")
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;

    public PushNotificationController(PushNotificationService pushNotificationService) {
        this.pushNotificationService = pushNotificationService;
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendPushNotification(@Valid @RequestBody PushNotificationRequest request) {
        pushNotificationService.sendPushNotification(request);
        return ResponseEntity.ok(ApiResponse.success("Push notification sent successfully"));
    }
}
