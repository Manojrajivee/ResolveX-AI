package com.resolvex.ai.service;

import com.resolvex.ai.dto.PermissionRequest;
import com.resolvex.ai.dto.PermissionResponse;

import java.util.List;

public interface PermissionService {
    
    PermissionResponse createPermission(PermissionRequest request, String adminEmail);
    
    List<PermissionResponse> getAllPermissions();
}
