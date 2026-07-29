package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminConfig {

    @Value("${app.admin.default-super-admin:admin@resolvex.ai}")
    private String defaultSuperAdmin;

    public String getDefaultSuperAdmin() {
        return defaultSuperAdmin;
    }
}
