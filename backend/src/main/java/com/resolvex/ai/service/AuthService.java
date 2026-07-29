package com.resolvex.ai.service;

import com.resolvex.ai.dto.LoginRequest;
import com.resolvex.ai.dto.LoginResponse;
import com.resolvex.ai.dto.RegisterRequest;

public interface AuthService {
    
    LoginResponse register(RegisterRequest request);
    
    LoginResponse login(LoginRequest request);
}
