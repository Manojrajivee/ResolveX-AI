package com.resolvex.ai.controller;

import com.resolvex.ai.dto.APIKeyResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.APIKeyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apikeys")
@PreAuthorize("hasRole('ADMIN')")
public class APIKeyController {

    private final APIKeyService apiKeyService;

    public APIKeyController(APIKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<APIKeyResponse>> generateAPIKey(
            @RequestParam String name,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails.getUsername();
        APIKeyResponse response = apiKeyService.generateAPIKey(name, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("API key generated successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<APIKeyResponse>>> getAllAPIKeys() {
        List<APIKeyResponse> keys = apiKeyService.getAllAPIKeys();
        return ResponseEntity.ok(ApiResponse.success("API keys retrieved successfully", keys));
    }

    @PutMapping("/{id}/revoke")
    public ResponseEntity<ApiResponse<Void>> revokeAPIKey(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails.getUsername();
        apiKeyService.revokeAPIKey(id, adminEmail);
        return ResponseEntity.ok(ApiResponse.success("API key revoked successfully"));
    }
}
