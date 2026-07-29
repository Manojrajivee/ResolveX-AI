package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "analytics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Analytics {

    @Id
    private String id;

    private long incidentCount;

    private long resolvedCount;

    private long pendingCount;

    private long criticalCount;

    private String averageResolutionTime; // e.g. "2.4 hours"

    @CreatedDate
    private LocalDateTime generatedAt;
}
