package com.resolvex.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSettingsRequest {

    @NotBlank(message = "Application name is required")
    private String applicationName;

    private boolean maintenanceMode;

    private String defaultLanguage;

    private String defaultTheme;
}
