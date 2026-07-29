package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    private String id;

    private String title;

    private String description;

    private IncidentCategory category;

    private IncidentPriority priority;

    private IncidentSeverity severity;

    @Builder.Default
    private IncidentStatus status = IncidentStatus.OPEN;

    private String createdBy;

    private String assignedTo;

    // AI Analysis fields
    private String aiSummary;

    private String rootCause;

    private String suggestedFix;

    private String preventionTips;

    private String estimatedResolutionTime;

    private Double confidenceScore;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
