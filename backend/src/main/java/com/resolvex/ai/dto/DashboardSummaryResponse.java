package com.resolvex.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private long totalIncidents;
    
    private long openIncidents;
    
    private long resolvedIncidents;
    
    private long criticalIncidents;
    
    private String averageResolutionTime;
    
    private List<String> topEngineers;
    
    private List<String> mostCommonCategories;
}
