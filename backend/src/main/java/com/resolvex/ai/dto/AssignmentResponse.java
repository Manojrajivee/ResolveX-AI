package com.resolvex.ai.dto;

import com.resolvex.ai.model.AssignmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentResponse {

    private String id;
    
    private String incidentId;
    
    private String engineerId;
    
    private boolean recommendedByAI;
    
    private LocalDateTime assignedAt;
    
    private LocalDateTime deadline;
    
    private AssignmentStatus status;
}
