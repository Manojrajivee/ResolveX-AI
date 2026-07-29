package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SlackConfig {

    @Value("${app.slack.webhook-url:}")
    private String webhookUrl;

    public String getWebhookUrl() {
        return webhookUrl;
    }
}
