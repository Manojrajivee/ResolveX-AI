package com.resolvex.ai.controller;

import com.resolvex.ai.dto.InsightResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.InsightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final InsightService insightService;

    public InsightController(InsightService insightService) {
        this.insightService = insightService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InsightResponse>>> getInsights() {
        List<InsightResponse> insights = insightService.getInsights();
        return ResponseEntity.ok(ApiResponse.success("AI Insights retrieved successfully", insights));
    }
}
