package com.resolvex.ai.dto;

import com.resolvex.ai.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentResponse {

    private String id;
    
    private String title;
    
    private String description;
    
    private IncidentCategory category;
    
    private IncidentPriority priority;
    
    private IncidentSeverity severity;
    
    private IncidentStatus status;
    
    private String createdBy;
    
    private String assignedTo;
    
    // AI Analysis results
    private String aiSummary;
    
    private String rootCause;
    
    private String suggestedFix;
    
    private String preventionTips;
    
    private String estimatedResolutionTime;
    
    private Double confidenceScore;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
