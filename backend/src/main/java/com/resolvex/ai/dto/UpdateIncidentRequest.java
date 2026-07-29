package com.resolvex.ai.dto;

import com.resolvex.ai.model.IncidentCategory;
import com.resolvex.ai.model.IncidentPriority;
import com.resolvex.ai.model.IncidentSeverity;
import com.resolvex.ai.model.IncidentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateIncidentRequest {

    private String title;
    
    private String description;
    
    private IncidentCategory category;
    
    private IncidentPriority priority;
    
    private IncidentSeverity severity;
    
    private IncidentStatus status;
    
    private String assignedTo;
}
