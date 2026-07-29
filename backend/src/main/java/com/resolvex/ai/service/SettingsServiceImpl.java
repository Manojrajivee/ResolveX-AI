package com.resolvex.ai.service;

import com.resolvex.ai.dto.SystemSettingsRequest;
import com.resolvex.ai.dto.SystemSettingsResponse;
import com.resolvex.ai.model.SystemSettings;
import com.resolvex.ai.repository.SettingsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository settingsRepository;
    private final AuditService auditService;

    public SettingsServiceImpl(SettingsRepository settingsRepository, AuditService auditService) {
        this.settingsRepository = settingsRepository;
        this.auditService = auditService;
    }

    @Override
    public SystemSettingsResponse getSettings() {
        SystemSettings settings = settingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    SystemSettings defaultSettings = SystemSettings.builder()
                            .applicationName("ResolveX AI")
                            .maintenanceMode(false)
                            .defaultLanguage("en")
                            .defaultTheme("dark")
                            .updatedAt(LocalDateTime.now())
                            .build();
                    return settingsRepository.save(defaultSettings);
                });
        return mapToResponse(settings);
    }

    @Override
    public SystemSettingsResponse updateSettings(SystemSettingsRequest request, String adminEmail) {
        SystemSettings settings = settingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> SystemSettings.builder().build());

        settings.setApplicationName(request.getApplicationName());
        settings.setMaintenanceMode(request.isMaintenanceMode());
        settings.setDefaultLanguage(request.getDefaultLanguage());
        settings.setDefaultTheme(request.getDefaultTheme());
        settings.setUpdatedAt(LocalDateTime.now());

        SystemSettings saved = settingsRepository.save(settings);

        auditService.logAction(adminEmail, "SYSTEM_SETTINGS_UPDATE: Name=" + saved.getApplicationName() + ", Maintenance=" + saved.isMaintenanceMode(), "ADMIN_PANEL", "0.0.0.0", "Internal");

        return mapToResponse(saved);
    }

    private SystemSettingsResponse mapToResponse(SystemSettings settings) {
        return SystemSettingsResponse.builder()
                .id(settings.getId())
                .applicationName(settings.getApplicationName())
                .maintenanceMode(settings.isMaintenanceMode())
                .defaultLanguage(settings.getDefaultLanguage())
                .defaultTheme(settings.getDefaultTheme())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
