package com.resolvex.ai.dto;

import com.resolvex.ai.model.ReportStatus;
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
public class ReportResponse {

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

    private ReportStatus status;

    private LocalDateTime generatedAt;

    private String reportUrl;
}
