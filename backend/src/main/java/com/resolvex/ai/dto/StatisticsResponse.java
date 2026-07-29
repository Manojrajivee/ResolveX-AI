package com.resolvex.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsResponse {

    private long totalIncidents;
    
    private long resolvedIncidents;
    
    private long commandsExecuted;
    
    private double successfulCommandRate; // percentage (e.g. 96.5%)
    
    private String averageResolutionTime;
    
    private List<Map<String, Object>> engineerBreakdown;
    
    private List<Map<String, Object>> runbookUsageBreakdown;
    
    private List<Map<String, Object>> statusBreakdown;
    
    private List<Map<String, Object>> commandExecutionBreakdown;
}
