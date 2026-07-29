package com.resolvex.ai.dto;

import com.resolvex.ai.model.ReportFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportRequest {

    @NotNull(message = "Export format is required")
    private ReportFormat format;
}
