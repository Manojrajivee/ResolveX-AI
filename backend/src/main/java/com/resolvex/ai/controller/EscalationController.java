package com.resolvex.ai.controller;

import com.resolvex.ai.dto.EscalationRequest;
import com.resolvex.ai.dto.EscalationResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.EscalationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/escalations")
public class EscalationController {

    private final EscalationService escalationService;

    public EscalationController(EscalationService escalationService) {
        this.escalationService = escalationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EscalationResponse>> escalateIncident(@Valid @RequestBody EscalationRequest request) {
        EscalationResponse response = escalationService.escalateIncident(request);
        return new ResponseEntity<>(ApiResponse.success("Incident escalated successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EscalationResponse>>> getEscalations(
            @RequestParam(required = false) String incidentId,
            @RequestParam(required = false) String manager) {
        
        List<EscalationResponse> escalations;
        if (incidentId != null && !incidentId.isBlank()) {
            escalations = escalationService.getEscalationsForIncident(incidentId);
        } else if (manager != null && !manager.isBlank()) {
            escalations = escalationService.getEscalationsByManager(manager);
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Query parameter incidentId or manager is required", "Missing query parameter"));
        }
        return ResponseEntity.ok(ApiResponse.success("Escalations retrieved successfully", escalations));
    }
}
