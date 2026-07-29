package com.resolvex.ai.controller;

import com.resolvex.ai.dto.FeatureFlagRequest;
import com.resolvex.ai.dto.FeatureFlagResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.FeatureFlagService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
public class FeatureFlagController {

    private final FeatureFlagService featureFlagService;

    public FeatureFlagController(FeatureFlagService featureFlagService) {
        this.featureFlagService = featureFlagService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FeatureFlagResponse>> toggleFeature(
            @Valid @RequestBody FeatureFlagRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails.getUsername();
        FeatureFlagResponse response = featureFlagService.createOrUpdateFlag(request.getFeatureName(), request.isEnabled(), adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Feature flag updated successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeatureFlagResponse>>> getAllFlags() {
        List<FeatureFlagResponse> responses = featureFlagService.getAllFlags();
        return ResponseEntity.ok(ApiResponse.success("Feature flags retrieved successfully", responses));
    }
}
