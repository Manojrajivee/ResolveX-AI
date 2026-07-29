package com.resolvex.ai.dto;

import com.resolvex.ai.model.EscalationLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EscalationResponse {

    private String id;
    
    private String incidentId;
    
    private EscalationLevel level;
    
    private String reason;
    
    private String assignedManager;
    
    private LocalDateTime escalatedAt;
}
