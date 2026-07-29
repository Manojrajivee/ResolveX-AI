package com.resolvex.ai.service;

import com.resolvex.ai.exception.AdminException;
import com.resolvex.ai.model.Role;
import com.resolvex.ai.model.User;
import com.resolvex.ai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AuditService auditService;

    public AdminServiceImpl(UserRepository userRepository, AuditService auditService) {
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUserStatus(String userId, boolean active, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AdminException("User not found with id: " + userId));

        user.setActive(active);
        User saved = userRepository.save(user);

        // Audit log action
        auditService.logAction(adminEmail, "USER_STATUS_UPDATE: " + user.getEmail() + " set to " + (active ? "ACTIVE" : "INACTIVE"), "ADMIN_PANEL", "0.0.0.0", "Internal");

        return saved;
    }

    @Override
    public void deleteUser(String userId, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AdminException("User not found with id: " + userId));

        userRepository.delete(user);

        // Audit log action
        auditService.logAction(adminEmail, "USER_DELETED: " + user.getEmail(), "ADMIN_PANEL", "0.0.0.0", "Internal");
    }

    @Override
    public User assignUserRole(String userId, Role role, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AdminException("User not found with id: " + userId));

        user.setRole(role);
        User saved = userRepository.save(user);

        // Audit log action
        auditService.logAction(adminEmail, "USER_ROLE_ASSIGN: " + user.getEmail() + " to " + role.name(), "ADMIN_PANEL", "0.0.0.0", "Internal");

        return saved;
    }
}
