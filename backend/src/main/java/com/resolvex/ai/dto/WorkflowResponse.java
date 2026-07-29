package com.resolvex.ai.dto;

import com.resolvex.ai.model.WorkflowStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowResponse {

    private String id;
    
    private String incidentId;
    
    private String workflowName;
    
    private WorkflowStatus status;
    
    private String createdBy;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
