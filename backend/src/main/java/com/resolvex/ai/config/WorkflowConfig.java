package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WorkflowConfig {

    @Value("${app.workflow.default-sla-hours:24}")
    private int defaultSlaHours;

    @Value("${app.workflow.escalation-manager:manager@resolvex.ai}")
    private String defaultEscalationManager;

    public int getDefaultSlaHours() {
        return defaultSlaHours;
    }

    public String getDefaultEscalationManager() {
        return defaultEscalationManager;
    }
}
