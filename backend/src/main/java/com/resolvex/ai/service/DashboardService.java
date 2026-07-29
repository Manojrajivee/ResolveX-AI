package com.resolvex.ai.service;

import com.resolvex.ai.dto.AnalyticsRequest;
import com.resolvex.ai.dto.ChartResponse;
import com.resolvex.ai.dto.DashboardSummaryResponse;
import com.resolvex.ai.dto.StatisticsResponse;

import java.util.Map;

public interface DashboardService {
    
    DashboardSummaryResponse getSummary();
    
    ChartResponse getCharts();
    
    StatisticsResponse getStatistics(AnalyticsRequest request);
    
    Map<String, Object> getRecent();
}
