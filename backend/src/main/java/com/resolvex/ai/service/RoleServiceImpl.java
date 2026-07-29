package com.resolvex.ai.service;

import com.resolvex.ai.dto.RoleRequest;
import com.resolvex.ai.dto.RoleResponse;
import com.resolvex.ai.exception.PermissionException;
import com.resolvex.ai.model.SystemRole;
import com.resolvex.ai.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final AuditService auditService;

    public RoleServiceImpl(RoleRepository roleRepository, AuditService auditService) {
        this.roleRepository = roleRepository;
        this.auditService = auditService;
    }

    @Override
    public RoleResponse createRole(RoleRequest request, String adminEmail) {
        if (roleRepository.findByName(request.getName()).isPresent()) {
            throw new PermissionException("Role name already exists: " + request.getName());
        }

        SystemRole role = SystemRole.builder()
                .name(request.getName().toUpperCase())
                .permissions(request.getPermissions())
                .build();

        SystemRole saved = roleRepository.save(role);

        auditService.logAction(adminEmail, "ROLE_CREATED: " + saved.getName(), "ADMIN_PANEL", "0.0.0.0", "Internal");

        return mapToResponse(saved);
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse updateRole(String id, RoleRequest request, String adminEmail) {
        SystemRole role = roleRepository.findById(id)
                .orElseThrow(() -> new PermissionException("Role not found with id: " + id));

        role.setName(request.getName().toUpperCase());
        role.setPermissions(request.getPermissions());
        SystemRole updated = roleRepository.save(role);

        auditService.logAction(adminEmail, "ROLE_UPDATED: " + updated.getName(), "ADMIN_PANEL", "0.0.0.0", "Internal");

        return mapToResponse(updated);
    }

    @Override
    public void deleteRole(String id, String adminEmail) {
        SystemRole role = roleRepository.findById(id)
                .orElseThrow(() -> new PermissionException("Role not found with id: " + id));

        roleRepository.delete(role);

        auditService.logAction(adminEmail, "ROLE_DELETED: " + role.getName(), "ADMIN_PANEL", "0.0.0.0", "Internal");
    }

    private RoleResponse mapToResponse(SystemRole role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .permissions(role.getPermissions())
                .build();
    }
}
