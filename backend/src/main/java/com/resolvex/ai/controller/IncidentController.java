package com.resolvex.ai.controller;

import com.resolvex.ai.dto.*;
import com.resolvex.ai.model.IncidentCategory;
import com.resolvex.ai.model.IncidentPriority;
import com.resolvex.ai.model.IncidentSeverity;
import com.resolvex.ai.model.IncidentStatus;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IncidentResponse>> createIncident(
            @Valid @RequestBody CreateIncidentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String createdBy = userDetails.getUsername();
        IncidentResponse response = incidentService.createIncident(request, createdBy);
        return new ResponseEntity<>(ApiResponse.success("Incident created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<IncidentListResponse>> getAllIncidents(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) IncidentCategory category,
            @RequestParam(required = false) IncidentPriority priority,
            @RequestParam(required = false) IncidentSeverity severity,
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        IncidentListResponse response = incidentService.getAllIncidents(
                title, category, priority, severity, status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Incidents retrieved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentResponse>> getIncidentById(@PathVariable String id) {
        IncidentResponse response = incidentService.getIncidentById(id);
        return ResponseEntity.ok(ApiResponse.success("Incident retrieved successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IncidentResponse>> updateIncident(
            @PathVariable String id,
            @Valid @RequestBody UpdateIncidentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String email = userDetails.getUsername();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        IncidentResponse response = incidentService.updateIncident(id, request, email, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Incident updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncident(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String email = userDetails.getUsername();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        incidentService.deleteIncident(id, email, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Incident deleted successfully"));
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<ApiResponse<IncidentAnalysisResponse>> analyzeIncident(@PathVariable String id) {
        IncidentAnalysisResponse response = incidentService.analyzeIncident(id);
        return ResponseEntity.ok(ApiResponse.success("Incident analysis completed successfully", response));
    }
}
