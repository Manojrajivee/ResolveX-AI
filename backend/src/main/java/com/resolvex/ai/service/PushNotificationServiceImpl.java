package com.resolvex.ai.service;

import com.resolvex.ai.config.FirebaseConfig;
import com.resolvex.ai.dto.PushNotificationRequest;
import org.springframework.stereotype.Service;

@Service
public class PushNotificationServiceImpl implements PushNotificationService {

    private final FirebaseConfig firebaseConfig;

    public PushNotificationServiceImpl(FirebaseConfig firebaseConfig) {
        this.firebaseConfig = firebaseConfig;
    }

    @Override
    public void sendPushNotification(PushNotificationRequest request) {
        if (firebaseConfig.getFirebaseConfigPath() == null || firebaseConfig.getFirebaseConfigPath().isBlank()) {
            System.out.println("====== [OFFLINE MOCK FCM PUSH] ======");
            System.out.println("Token: " + request.getTargetToken());
            System.out.println("Title: " + request.getTitle());
            System.out.println("Body: " + request.getBody());
            System.out.println("=====================================");
            return;
        }

        System.out.println("Firebase FCM Client: Dispatching push notification to target token: " + request.getTargetToken());
    }
}
