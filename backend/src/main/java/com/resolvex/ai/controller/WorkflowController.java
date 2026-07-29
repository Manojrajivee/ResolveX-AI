package com.resolvex.ai.controller;

import com.resolvex.ai.dto.CreateWorkflowRequest;
import com.resolvex.ai.dto.WorkflowResponse;
import com.resolvex.ai.model.WorkflowStatus;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.WorkflowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkflowResponse>> createWorkflow(
            @Valid @RequestBody CreateWorkflowRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String createdBy = userDetails.getUsername();
        WorkflowResponse response = workflowService.createWorkflow(request, createdBy);
        return new ResponseEntity<>(ApiResponse.success("Workflow created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkflowResponse>>> getAllWorkflows() {
        List<WorkflowResponse> responses = workflowService.getAllWorkflows();
        return ResponseEntity.ok(ApiResponse.success("Workflows retrieved successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkflowResponse>> getWorkflowById(@PathVariable String id) {
        WorkflowResponse response = workflowService.getWorkflowById(id);
        return ResponseEntity.ok(ApiResponse.success("Workflow retrieved successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkflowResponse>> updateWorkflowStatus(
            @PathVariable String id,
            @RequestParam WorkflowStatus status) {
        WorkflowResponse response = workflowService.updateWorkflowStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Workflow status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteWorkflow(@PathVariable String id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.ok(ApiResponse.success("Workflow deleted successfully"));
    }
}
