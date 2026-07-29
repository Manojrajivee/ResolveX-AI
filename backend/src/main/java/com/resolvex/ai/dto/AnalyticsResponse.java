package com.resolvex.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {

    private long totalProcessed;
    
    private Map<String, Long> categoryDistribution;
    
    private Map<String, Long> severityDistribution;
    
    private Map<String, Long> priorityDistribution;
    
    private Map<String, Long> statusDistribution;
    
    private double slaComplianceRate; // Percentage (e.g. 94.5%)
    
    private double aiAccuracyRate;     // Percentage of correct AI determinations
}
