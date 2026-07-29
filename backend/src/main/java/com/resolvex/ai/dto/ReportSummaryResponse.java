package com.resolvex.ai.dto;

import com.resolvex.ai.model.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportSummaryResponse {

    private String id;

    private String incidentId;

    private String title;

    private ReportStatus status;

    private LocalDateTime generatedAt;

    private String userId;

    private String reportUrl;
}
