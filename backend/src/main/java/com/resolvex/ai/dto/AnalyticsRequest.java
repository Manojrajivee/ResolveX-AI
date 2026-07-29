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
public class AnalyticsRequest {

    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private String engineer;
    
    private String category;
    
    private String priority;
    
    private String severity;
    
    private String status;
}
