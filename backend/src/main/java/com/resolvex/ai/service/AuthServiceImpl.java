package com.resolvex.ai.service;

import com.resolvex.ai.dto.LoginRequest;
import com.resolvex.ai.dto.LoginResponse;
import com.resolvex.ai.dto.RegisterRequest;
import com.resolvex.ai.exception.EmailAlreadyExistsException;
import com.resolvex.ai.exception.InvalidCredentialsException;
import com.resolvex.ai.model.User;
import com.resolvex.ai.repository.UserRepository;
import com.resolvex.ai.security.JwtUtil;
import com.resolvex.ai.security.UserPrincipal;
import com.resolvex.ai.utils.ValidationUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public LoginResponse register(RegisterRequest request) {
        // Validate request fields and password policy
        ValidationUtil.validateRegistration(request);

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email address is already registered: " + request.getEmail());
        }

        // Encrypt password using BCrypt
        String encryptedPassword = passwordEncoder.encode(request.getPassword());

        // Create User entity
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encryptedPassword)
                .role(request.getRole())
                .build();

        User savedUser = userRepository.save(user);

        // Generate JWT token
        UserPrincipal principal = new UserPrincipal(savedUser);
        String token = jwtUtil.generateToken(principal);

        return LoginResponse.builder()
                .token(token)
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .expiresIn(jwtUtil.getExpirationMs())
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // Validation checks
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new InvalidCredentialsException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new InvalidCredentialsException("Password is required");
        }

        // Fetch user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Match encrypted password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Generate JWT token
        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtUtil.generateToken(principal);

        return LoginResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresIn(jwtUtil.getExpirationMs())
                .build();
    }
}
