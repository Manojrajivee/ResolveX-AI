package com.resolvex.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushNotificationRequest {

    @NotBlank(message = "Target registration token is required")
    private String targetToken;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Body content is required")
    private String body;
}
