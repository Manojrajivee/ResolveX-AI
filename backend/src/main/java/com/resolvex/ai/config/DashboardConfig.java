package com.resolvex.ai.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class DashboardConfig {

    @Value("${app.dashboard.refresh-interval-seconds:60}")
    private int refreshIntervalSeconds;

    @Value("${app.dashboard.max-recent-activities:10}")
    private int maxRecentActivities;

    @Value("${app.dashboard.max-recent-reports:5}")
    private int maxRecentReports;
}
