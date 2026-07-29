package com.resolvex.ai.dto;

import com.resolvex.ai.model.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalResponse {

    private String id;
    
    private String workflowId;
    
    private String approverId;
    
    private ApprovalStatus status;
    
    private String comments;
    
    private LocalDateTime approvedAt;
}
