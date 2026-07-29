package com.resolvex.ai.service;

import com.resolvex.ai.dto.AnalyticsRequest;
import com.resolvex.ai.dto.AnalyticsResponse;
import com.resolvex.ai.dto.ChartDataResponse;

public interface AnalyticsService {
    
    AnalyticsResponse getFilteredAnalytics(AnalyticsRequest request);
    
    ChartDataResponse getChartData(String chartType);
}
