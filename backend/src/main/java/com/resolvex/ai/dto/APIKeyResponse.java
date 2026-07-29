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
public class APIKeyResponse {

    private String id;
    
    private String name;
    
    private String apiKey;
    
    private String status;
    
    private LocalDateTime createdAt;
}
