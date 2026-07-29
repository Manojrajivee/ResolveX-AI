package com.resolvex.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditResponse {

    private String id;
    
    private String userId;
    
    private String action;
    
    private String module;
    
    private String ipAddress;
    
    private String browser;
    
    private LocalDateTime createdAt;
}
