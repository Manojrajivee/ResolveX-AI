package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "incident_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentReport {

    @Id
    private String id;

    private String incidentId;

    private String userId;

    private String runbookId;

    private String title;

    private String problemStatement;

    private List<String> commandsExecuted;

    private List<String> commandOutputs;

    private String aiAnalysis;

    private List<String> resolutionSteps;

    private String executionTime;

    @Builder.Default
    private ReportStatus status = ReportStatus.SUCCESS;

    @CreatedDate
    private LocalDateTime generatedAt;

    private String reportUrl;
}
