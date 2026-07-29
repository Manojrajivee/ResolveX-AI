package com.resolvex.ai.service;

import com.resolvex.ai.model.Role;
import com.resolvex.ai.model.User;

import java.util.List;

public interface AdminService {
    
    List<User> getAllUsers();
    
    User updateUserStatus(String userId, boolean active, String adminEmail);
    
    void deleteUser(String userId, String adminEmail);
    
    User assignUserRole(String userId, Role role, String adminEmail);
}
