package com.resolvex.ai.service;

import com.resolvex.ai.dto.PermissionRequest;
import com.resolvex.ai.dto.PermissionResponse;
import com.resolvex.ai.exception.PermissionException;
import com.resolvex.ai.model.Permission;
import com.resolvex.ai.repository.PermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final AuditService auditService;

    public PermissionServiceImpl(PermissionRepository permissionRepository, AuditService auditService) {
        this.permissionRepository = permissionRepository;
        this.auditService = auditService;
    }

    @Override
    public PermissionResponse createPermission(PermissionRequest request, String adminEmail) {
        if (permissionRepository.findByName(request.getName()).isPresent()) {
            throw new PermissionException("Permission name already exists: " + request.getName());
        }

        Permission permission = Permission.builder()
                .name(request.getName().toUpperCase())
                .description(request.getDescription())
                .build();

        Permission saved = permissionRepository.save(permission);

        auditService.logAction(adminEmail, "PERMISSION_CREATED: " + saved.getName(), "ADMIN_PANEL", "0.0.0.0", "Internal");

        return mapToResponse(saved);
    }

    @Override
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PermissionResponse mapToResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .description(permission.getDescription())
                .build();
    }
}
