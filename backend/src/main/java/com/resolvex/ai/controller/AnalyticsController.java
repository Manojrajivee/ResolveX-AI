package com.resolvex.ai.controller;

import com.resolvex.ai.dto.AnalyticsRequest;
import com.resolvex.ai.dto.AnalyticsResponse;
import com.resolvex.ai.dto.ChartDataResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ChartDataResponse>> getChartData(@RequestParam(defaultValue = "LINE") String chartType) {
        ChartDataResponse chartData = analyticsService.getChartData(chartType);
        return ResponseEntity.ok(ApiResponse.success("Chart dataset retrieved successfully", chartData));
    }

    @PostMapping("/filter")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getFilteredAnalytics(@RequestBody AnalyticsRequest request) {
        AnalyticsResponse response = analyticsService.getFilteredAnalytics(request);
        return ResponseEntity.ok(ApiResponse.success("Filtered metrics compiled successfully", response));
    }
}
