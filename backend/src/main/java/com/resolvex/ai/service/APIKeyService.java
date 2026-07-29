package com.resolvex.ai.service;

import com.resolvex.ai.dto.APIKeyResponse;

import java.util.List;

public interface APIKeyService {
    
    APIKeyResponse generateAPIKey(String name, String adminEmail);
    
    List<APIKeyResponse> getAllAPIKeys();
    
    void revokeAPIKey(String id, String adminEmail);
}
