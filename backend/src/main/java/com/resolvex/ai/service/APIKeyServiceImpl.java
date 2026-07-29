package com.resolvex.ai.service;

import com.resolvex.ai.dto.APIKeyResponse;
import com.resolvex.ai.exception.AdminException;
import com.resolvex.ai.model.APIKey;
import com.resolvex.ai.repository.APIKeyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class APIKeyServiceImpl implements APIKeyService {

    private final APIKeyRepository apiKeyRepository;
    private final AuditService auditService;

    public APIKeyServiceImpl(APIKeyRepository apiKeyRepository, AuditService auditService) {
        this.apiKeyRepository = apiKeyRepository;
        this.auditService = auditService;
    }

    @Override
    public APIKeyResponse generateAPIKey(String name, String adminEmail) {
        String generatedRaw = "rx_" + UUID.randomUUID().toString().replace("-", "");

        APIKey apiKey = APIKey.builder()
                .name(name)
                .apiKey(generatedRaw)
                .status("ACTIVE")
                .build();

        APIKey saved = apiKeyRepository.save(apiKey);

        auditService.logAction(adminEmail, "API_KEY_GENERATED: Description=" + name, "API_KEY_SYSTEM", "0.0.0.0", "Internal");

        return mapToResponse(saved);
    }

    @Override
    public List<APIKeyResponse> getAllAPIKeys() {
        return apiKeyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void revokeAPIKey(String id, String adminEmail) {
        APIKey key = apiKeyRepository.findById(id)
                .orElseThrow(() -> new AdminException("API Key not found with id: " + id));

        key.setStatus("REVOKED");
        apiKeyRepository.save(key);

        auditService.logAction(adminEmail, "API_KEY_REVOKED: name=" + key.getName(), "API_KEY_SYSTEM", "0.0.0.0", "Internal");
    }

    private APIKeyResponse mapToResponse(APIKey key) {
        return APIKeyResponse.builder()
                .id(key.getId())
                .name(key.getName())
                .apiKey(key.getApiKey())
                .status(key.getStatus())
                .createdAt(key.getCreatedAt())
                .build();
    }
}
