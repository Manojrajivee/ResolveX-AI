package com.resolvex.ai.dto;

import com.resolvex.ai.model.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportRequest {

    @NotBlank(message = "Report name is required")
    private String name;

    @NotNull(message = "Report type is required")
    private ReportType type;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotBlank(message = "Format (PDF/CSV/EXCEL) is required")
    private String format;
}
