package com.resolvex.ai.controller;

import com.resolvex.ai.dto.AssignmentRequest;
import com.resolvex.ai.dto.AssignmentResponse;
import com.resolvex.ai.model.AssignmentStatus;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY')")
    public ResponseEntity<ApiResponse<AssignmentResponse>> assignIncident(@Valid @RequestBody AssignmentRequest request) {
        AssignmentResponse response = assignmentService.assignIncident(request);
        return new ResponseEntity<>(ApiResponse.success("Incident assigned successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignments(
            @RequestParam(required = false) String engineerId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String targetEngineer = (engineerId != null && !engineerId.isBlank()) ? engineerId : userDetails.getUsername();
        List<AssignmentResponse> assignments = assignmentService.getAssignmentsByEngineer(targetEngineer);
        return ResponseEntity.ok(ApiResponse.success("Assignments retrieved successfully", assignments));
    }

    @GetMapping("/recommend/{incidentId}")
    public ResponseEntity<ApiResponse<String>> recommendEngineer(@PathVariable String incidentId) {
        String recommendedEmail = assignmentService.recommendEngineer(incidentId);
        return ResponseEntity.ok(ApiResponse.success("AI Recommendation calculated", recommendedEmail));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<AssignmentResponse>> acceptAssignment(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String engineerId = userDetails.getUsername();
        AssignmentResponse response = assignmentService.acceptAssignment(id, engineerId);
        return ResponseEntity.ok(ApiResponse.success("Assignment accepted successfully", response));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AssignmentResponse>> updateStatus(
            @PathVariable String id,
            @RequestParam AssignmentStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        String engineerId = userDetails.getUsername();
        AssignmentResponse response = assignmentService.updateAssignmentStatus(id, status, engineerId);
        return ResponseEntity.ok(ApiResponse.success("Assignment status updated successfully", response));
    }
}
