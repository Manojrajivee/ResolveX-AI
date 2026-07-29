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
public class LogResponse {

    private String id;
    
    private String logType; // SYSTEM, EXECUTION
    
    private String level; // INFO, WARN, ERROR, SUCCESS, FAILED
    
    private String source; // e.g. AUTH, RUNBOOK_UPLOAD, command name
    
    private String message;
    
    private LocalDateTime timestamp;
}
