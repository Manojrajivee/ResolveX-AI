package com.resolvex.ai.controller;

import com.resolvex.ai.dto.AnalyticsRequest;
import com.resolvex.ai.dto.StatisticsResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final DashboardService dashboardService;

    public StatisticsController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<StatisticsResponse>> getStatistics(AnalyticsRequest request) {
        StatisticsResponse stats = dashboardService.getStatistics(request);
        return ResponseEntity.ok(ApiResponse.success("Statistics compiled successfully", stats));
    }
}
