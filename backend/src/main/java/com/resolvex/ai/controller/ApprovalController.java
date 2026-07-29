package com.resolvex.ai.controller;

import com.resolvex.ai.dto.ApprovalRequest;
import com.resolvex.ai.dto.ApprovalResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY')")
    public ResponseEntity<ApiResponse<ApprovalResponse>> submitDecision(
            @Valid @RequestBody ApprovalRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String approverId = userDetails.getUsername();
        ApprovalResponse response = approvalService.submitApprovalDecision(request, approverId);
        return ResponseEntity.ok(ApiResponse.success("Approval decision submitted successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApprovalResponse>>> getApprovals(
            @RequestParam(required = false) String workflowId,
            @RequestParam(required = false) String approverId) {
        
        List<ApprovalResponse> approvals;
        if (workflowId != null && !workflowId.isBlank()) {
            approvals = approvalService.getApprovalsForWorkflow(workflowId);
        } else if (approverId != null && !approverId.isBlank()) {
            approvals = approvalService.getApprovalsByApprover(approverId);
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Query parameter workflowId or approverId is required", "Missing query parameter"));
        }
        return ResponseEntity.ok(ApiResponse.success("Approvals retrieved successfully", approvals));
    }
}
