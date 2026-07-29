package com.resolvex.ai.service;

import com.resolvex.ai.dto.SlackRequest;

public interface SlackService {
    
    void sendSlackMessage(SlackRequest request);
}
