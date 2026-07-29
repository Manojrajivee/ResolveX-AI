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
public class InsightResponse {

    private String id;
    
    private String title;
    
    private String description;
    
    private double confidenceScore;
    
    private boolean generatedByAI;
    
    private LocalDateTime createdAt;
}
