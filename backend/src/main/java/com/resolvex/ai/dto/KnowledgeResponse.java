package com.resolvex.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeResponse {

    private String id;
    
    private String title;
    
    private String problem;
    
    private String solution;
    
    private List<String> keywords;
    
    private String incidentId;
    
    private LocalDateTime createdAt;
}
