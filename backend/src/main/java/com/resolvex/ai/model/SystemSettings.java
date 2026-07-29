package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSettings {

    @Id
    private String id;

    @Builder.Default
    private String applicationName = "ResolveX AI";

    @Builder.Default
    private boolean maintenanceMode = false;

    @Builder.Default
    private String defaultLanguage = "en";

    @Builder.Default
    private String defaultTheme = "dark";

    private LocalDateTime updatedAt;
}
