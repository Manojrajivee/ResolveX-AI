package com.resolvex.ai.service;

import com.resolvex.ai.dto.UpdateProfileRequest;
import com.resolvex.ai.dto.UserProfileResponse;

public interface UserService {
    
    UserProfileResponse getUserProfile(String email);
    
    UserProfileResponse updateUserProfile(String email, UpdateProfileRequest request);
}
