package com.resolvex.ai.service;

import com.resolvex.ai.dto.SystemSettingsRequest;
import com.resolvex.ai.dto.SystemSettingsResponse;

public interface SettingsService {
    
    SystemSettingsResponse getSettings();
    
    SystemSettingsResponse updateSettings(SystemSettingsRequest request, String adminEmail);
}
