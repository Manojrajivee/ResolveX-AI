package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AnalyticsConfig {

    @Value("${app.analytics.sla-target-percentage:95.0}")
    private double slaTargetPercentage;

    @Value("${app.analytics.ai-accuracy-threshold:80.0}")
    private double aiAccuracyThreshold;

    public double getSlaTargetPercentage() {
        return slaTargetPercentage;
    }

    public double getAiAccuracyThreshold() {
        return aiAccuracyThreshold;
    }
}
