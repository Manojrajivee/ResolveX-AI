package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseConfig {

    @Value("${app.push.firebase-config-path:}")
    private String firebaseConfigPath;

    public String getFirebaseConfigPath() {
        return firebaseConfigPath;
    }
}
