package com.resolvex.ai.controller;

import com.resolvex.ai.dto.AnalyticsRequest;
import com.resolvex.ai.dto.ChartResponse;
import com.resolvex.ai.dto.DashboardSummaryResponse;
import com.resolvex.ai.dto.StatisticsResponse;
import com.resolvex.ai.model.Dashboard;
import com.resolvex.ai.model.Dashboard.DashboardWidget;
import com.resolvex.ai.repository.DashboardRepository;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final DashboardRepository dashboardRepository;

    public DashboardController(DashboardService dashboardService, DashboardRepository dashboardRepository) {
        this.dashboardService = dashboardService;
        this.dashboardRepository = dashboardRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Dashboard>> getDefaultDashboard() {
        Dashboard dashboard = dashboardRepository.findByName("Default").orElseGet(() -> {
            Dashboard defaultDash = Dashboard.builder()
                    .name("Default")
                    .widgets(List.of(
                            DashboardWidget.builder().widgetId("w1").title("Incident Category Distribution").type("PIE_CHART").size(6).build(),
                            DashboardWidget.builder().widgetId("w2").title("Weekly Activities").type("LINE_CHART").size(6).build()
                    ))
                    .build();
            return dashboardRepository.save(defaultDash);
        });
        return ResponseEntity.ok(ApiResponse.success("Dashboard configuration retrieved successfully", dashboard));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary() {
        DashboardSummaryResponse summary = dashboardService.getSummary();
        return ResponseEntity.ok(ApiResponse.success("Dashboard KPI summary retrieved successfully", summary));
    }

    @GetMapping("/charts")
    public ResponseEntity<ApiResponse<ChartResponse>> getCharts() {
        ChartResponse charts = dashboardService.getCharts();
        return ResponseEntity.ok(ApiResponse.success("Dashboard charts data retrieved successfully", charts));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<StatisticsResponse>> getStatistics(AnalyticsRequest request) {
        StatisticsResponse statistics = dashboardService.getStatistics(request);
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics metrics compiled successfully", statistics));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRecent() {
        Map<String, Object> recent = dashboardService.getRecent();
        return ResponseEntity.ok(ApiResponse.success("Recent reports and activities compiled successfully", recent));
    }
}
