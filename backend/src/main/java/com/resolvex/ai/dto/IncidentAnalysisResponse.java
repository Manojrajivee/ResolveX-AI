package com.resolvex.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentAnalysisResponse {

    private String summary;
    
    private String rootCause;
    
    private String suggestedFix;
    
    private String preventionTips;
    
    private String estimatedResolutionTime;
    
    private Double confidenceScore;
}
