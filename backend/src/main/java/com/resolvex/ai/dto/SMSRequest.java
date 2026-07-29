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
public class SMSRequest {

    @NotBlank(message = "Recipient phone number is required")
    private String to;

    @NotBlank(message = "Message text is required")
    private String message;
}
