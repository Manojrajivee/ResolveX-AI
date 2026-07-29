package com.resolvex.ai.dto;

import com.resolvex.ai.model.ReportStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateReportRequest {

    @NotBlank(message = "Incident ID is required")
    private String incidentId;

    @NotBlank(message = "Runbook ID is required")
    private String runbookId;

    @NotEmpty(message = "Commands executed list is required")
    private List<String> commandsExecuted;

    private List<String> commandOutputs;

    private String title;

    private String problemStatement;

    private String aiAnalysis;

    private List<String> resolutionSteps;

    private String executionTime;

    @Builder.Default
    private ReportStatus status = ReportStatus.SUCCESS;
}
