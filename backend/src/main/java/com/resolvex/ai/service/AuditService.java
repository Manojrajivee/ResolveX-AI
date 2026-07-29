package com.resolvex.ai.service;

import com.resolvex.ai.dto.AuditResponse;

import java.util.List;

public interface AuditService {
    
    void logAction(String userId, String action, String module, String ipAddress, String browser);
    
    List<AuditResponse> getAuditLogs();
}
