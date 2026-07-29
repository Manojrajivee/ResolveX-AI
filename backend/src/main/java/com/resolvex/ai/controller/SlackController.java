package com.resolvex.ai.controller;

import com.resolvex.ai.dto.SlackRequest;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.SlackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/slack")
public class SlackController {

    private final SlackService slackService;

    public SlackController(SlackService slackService) {
        this.slackService = slackService;
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendSlackMessage(@Valid @RequestBody SlackRequest request) {
        slackService.sendSlackMessage(request);
        return ResponseEntity.ok(ApiResponse.success("Slack message sent successfully"));
    }
}
