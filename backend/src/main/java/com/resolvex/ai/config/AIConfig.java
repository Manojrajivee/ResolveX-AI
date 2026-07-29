package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {

    @Value("${app.ai.chat-model:gpt-4o-mini}")
    private String chatModel;

    @Value("${app.ai.temperature:0.7}")
    private double temperature;

    @Value("${app.ai.system-prompt:You are an expert AI Troubleshooting Assistant for ResolveX AI. Help the engineer resolve the incident. Use the provided conversation history, incident details, and knowledge base articles to formulate a detailed response.}")
    private String systemPrompt;

    public String getChatModel() {
        return chatModel;
    }

    public double getTemperature() {
        return temperature;
    }

    public String getSystemPrompt() {
        return systemPrompt;
    }
}
