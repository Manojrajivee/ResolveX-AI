package com.resolvex.ai.utils;

import com.resolvex.ai.dto.RegisterRequest;
import com.resolvex.ai.exception.InvalidCredentialsException;

import java.util.regex.Pattern;

public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@(.+)$"
    );

    // Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._\\-#+=\\[\\]{}()|<>:;]).{8,}$"
    );

    private ValidationUtil() {
        // Prevent instantiation
    }

    public static void validateEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new InvalidCredentialsException("Email cannot be null or blank");
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new InvalidCredentialsException("Invalid email format");
        }
    }

    public static void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new InvalidCredentialsException("Password cannot be null or blank");
        }
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new InvalidCredentialsException(
                    "Password must be at least 8 characters long and contain at least one uppercase letter, " +
                    "one lowercase letter, one digit, and one special character"
            );
        }
    }

    public static void validateRegistration(RegisterRequest request) {
        if (request == null) {
            throw new InvalidCredentialsException("Registration request cannot be null");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new InvalidCredentialsException("Name cannot be null or blank");
        }
        validateEmail(request.getEmail());
        validatePassword(request.getPassword());
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidCredentialsException("Passwords do not match");
        }
    }
}
