package com.resolvex.ai.dto;

import com.resolvex.ai.model.ApprovalStatus;
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
public class ApprovalRequest {

    @NotBlank(message = "Workflow ID is required")
    private String workflowId;

    @NotNull(message = "Approval status (APPROVED/REJECTED) is required")
    private ApprovalStatus status;

    private String comments;
}
