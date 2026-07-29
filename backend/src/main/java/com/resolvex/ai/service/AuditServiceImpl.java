package com.resolvex.ai.service;

import com.resolvex.ai.dto.AuditResponse;
import com.resolvex.ai.model.AuditLog;
import com.resolvex.ai.repository.AuditRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditServiceImpl implements AuditService {

    private final AuditRepository auditRepository;

    public AuditServiceImpl(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    @Override
    public void logAction(String userId, String action, String module, String ipAddress, String browser) {
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .action(action)
                .module(module)
                .ipAddress(ipAddress != null ? ipAddress : "0.0.0.0")
                .browser(browser != null ? browser : "Internal")
                .createdAt(LocalDateTime.now())
                .build();
        
        auditRepository.save(log);
        System.out.println(String.format("AUDIT_TRAIL [User: %s | Action: %s | Module: %s]", userId, action, module));
    }

    @Override
    public List<AuditResponse> getAuditLogs() {
        return auditRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AuditResponse mapToResponse(AuditLog log) {
        return AuditResponse.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .action(log.getAction())
                .module(log.getModule())
                .ipAddress(log.getIpAddress())
                .browser(log.getBrowser())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
