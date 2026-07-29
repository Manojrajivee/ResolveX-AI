package com.resolvex.ai.dto;

import com.resolvex.ai.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    
    @Builder.Default
    private String tokenType = "Bearer";
    private String name;
    private String email;
    private Role role;
    private long expiresIn;
}
