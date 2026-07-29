package com.resolvex.ai.service;

import com.resolvex.ai.config.SlackConfig;
import com.resolvex.ai.dto.SlackRequest;
import com.resolvex.ai.exception.SlackException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SlackServiceImpl implements SlackService {

    private final SlackConfig slackConfig;
    private final RestTemplate restTemplate;

    public SlackServiceImpl(SlackConfig slackConfig) {
        this.slackConfig = slackConfig;
        this.restTemplate = new RestTemplate();
    }

    @Override
    public void sendSlackMessage(SlackRequest request) {
        if (slackConfig.getWebhookUrl() == null || slackConfig.getWebhookUrl().isBlank()) {
            System.out.println("====== [OFFLINE MOCK SLACK] ======");
            System.out.println("Channel: " + request.getChannel());
            System.out.println("Message: " + request.getMessage());
            System.out.println("==================================");
            return;
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("text", request.getMessage());
            if (request.getChannel() != null) {
                payload.put("channel", request.getChannel());
            }

            restTemplate.postForLocation(slackConfig.getWebhookUrl(), payload);
            System.out.println("Slack Client: Dispatched webhook alert successfully.");
        } catch (Exception ex) {
            throw new SlackException("Failed to send message to Slack Webhook: " + ex.getMessage());
        }
    }
}
