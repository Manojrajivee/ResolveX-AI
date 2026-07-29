package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityPolicyConfig {

    @Value("${app.security.password-min-length:8}")
    private int passwordMinLength;

    @Value("${app.security.audit-enabled:true}")
    private boolean auditEnabled;

    public int getPasswordMinLength() {
        return passwordMinLength;
    }

    public boolean isAuditEnabled() {
        return auditEnabled;
    }
}
