package com.resolvex.ai.service;

import com.resolvex.ai.config.TeamsConfig;
import com.resolvex.ai.dto.TeamsRequest;
import com.resolvex.ai.exception.NotificationException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class TeamsServiceImpl implements TeamsService {

    private final TeamsConfig teamsConfig;
    private final RestTemplate restTemplate;

    public TeamsServiceImpl(TeamsConfig teamsConfig) {
        this.teamsConfig = teamsConfig;
        this.restTemplate = new RestTemplate();
    }

    @Override
    public void sendTeamsMessage(TeamsRequest request) {
        if (teamsConfig.getWebhookUrl() == null || teamsConfig.getWebhookUrl().isBlank()) {
            System.out.println("====== [OFFLINE MOCK TEAMS] ======");
            System.out.println("Message: " + request.getMessage());
            System.out.println("==================================");
            return;
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("text", request.getMessage());

            restTemplate.postForLocation(teamsConfig.getWebhookUrl(), payload);
            System.out.println("Teams Client: Dispatched webhook card alert successfully.");
        } catch (Exception ex) {
            throw new NotificationException("Failed to send message to MS Teams Webhook: " + ex.getMessage());
        }
    }
}
