package com.resolvex.ai.controller;

import com.resolvex.ai.dto.SystemSettingsRequest;
import com.resolvex.ai.dto.SystemSettingsResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SystemSettingsResponse>> getSettings() {
        SystemSettingsResponse response = settingsService.getSettings();
        return ResponseEntity.ok(ApiResponse.success("System settings retrieved successfully", response));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SystemSettingsResponse>> createOrUpdateSettings(
            @Valid @RequestBody SystemSettingsRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails.getUsername();
        SystemSettingsResponse response = settingsService.updateSettings(request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("System settings updated successfully", response));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SystemSettingsResponse>> updateSettings(
            @Valid @RequestBody SystemSettingsRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails.getUsername();
        SystemSettingsResponse response = settingsService.updateSettings(request, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("System settings updated successfully", response));
    }
}
