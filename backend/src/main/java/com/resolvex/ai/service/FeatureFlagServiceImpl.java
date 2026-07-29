package com.resolvex.ai.service;

import com.resolvex.ai.dto.FeatureFlagResponse;
import com.resolvex.ai.model.FeatureFlag;
import com.resolvex.ai.repository.FeatureFlagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeatureFlagServiceImpl implements FeatureFlagService {

    private final FeatureFlagRepository featureFlagRepository;
    private final AuditService auditService;

    public FeatureFlagServiceImpl(FeatureFlagRepository featureFlagRepository, AuditService auditService) {
        this.featureFlagRepository = featureFlagRepository;
        this.auditService = auditService;
    }

    @Override
    public FeatureFlagResponse createOrUpdateFlag(String featureName, boolean enabled, String adminEmail) {
        FeatureFlag flag = featureFlagRepository.findByFeatureName(featureName)
                .orElseGet(() -> FeatureFlag.builder().featureName(featureName).build());

        flag.setEnabled(enabled);
        FeatureFlag saved = featureFlagRepository.save(flag);

        auditService.logAction(adminEmail, "FEATURE_FLAG_UPDATE: " + featureName + "=" + enabled, "FEATURE_FLAGS", "0.0.0.0", "Internal");

        return mapToResponse(saved);
    }

    @Override
    public List<FeatureFlagResponse> getAllFlags() {
        return featureFlagRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isFeatureEnabled(String featureName) {
        return featureFlagRepository.findByFeatureName(featureName)
                .map(FeatureFlag::isEnabled)
                .orElse(true); // Default to enabled if not found
    }

    private FeatureFlagResponse mapToResponse(FeatureFlag flag) {
        return FeatureFlagResponse.builder()
                .id(flag.getId())
                .featureName(flag.getFeatureName())
                .enabled(flag.isEnabled())
                .build();
    }
}
