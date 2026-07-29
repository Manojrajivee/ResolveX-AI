package com.resolvex.ai.service;

import com.resolvex.ai.dto.FeatureFlagResponse;

import java.util.List;

public interface FeatureFlagService {
    
    FeatureFlagResponse createOrUpdateFlag(String featureName, boolean enabled, String adminEmail);
    
    List<FeatureFlagResponse> getAllFlags();
    
    boolean isFeatureEnabled(String featureName);
}
