package com.resolvex.ai.service;

import com.resolvex.ai.dto.RoleRequest;
import com.resolvex.ai.dto.RoleResponse;

import java.util.List;

public interface RoleService {
    
    RoleResponse createRole(RoleRequest request, String adminEmail);
    
    List<RoleResponse> getAllRoles();
    
    RoleResponse updateRole(String id, RoleRequest request, String adminEmail);
    
    void deleteRole(String id, String adminEmail);
}
