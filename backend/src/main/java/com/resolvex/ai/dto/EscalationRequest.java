package com.resolvex.ai.dto;

import com.resolvex.ai.model.EscalationLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EscalationRequest {

    @NotBlank(message = "Incident ID is required")
    private String incidentId;

    @NotNull(message = "Escalation level is required")
    private EscalationLevel level;

    @NotBlank(message = "Reason for escalation is required")
    private String reason;

    @NotBlank(message = "Assigned manager is required")
    private String assignedManager; // Manager's email
}
