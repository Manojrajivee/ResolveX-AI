package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "api_keys")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class APIKey {

    @Id
    private String id;

    private String name; // e.g. "Integrations Client"

    private String apiKey; // Hashed or obfuscated client token

    @Builder.Default
    private String status = "ACTIVE";

    @CreatedDate
    private LocalDateTime createdAt;
}
