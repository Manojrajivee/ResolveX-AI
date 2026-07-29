package com.resolvex.ai.service;

import com.resolvex.ai.dto.PushNotificationRequest;

public interface PushNotificationService {
    
    void sendPushNotification(PushNotificationRequest request);
}
