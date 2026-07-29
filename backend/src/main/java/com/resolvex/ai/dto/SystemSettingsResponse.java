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
public class SystemSettingsResponse {

    private String id;
    
    private String applicationName;
    
    private boolean maintenanceMode;
    
    private String defaultLanguage;
    
    private String defaultTheme;
    
    private LocalDateTime updatedAt;
}
