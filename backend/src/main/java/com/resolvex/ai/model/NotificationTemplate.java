package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationTemplate {

    @Id
    private String id;

    private String name; // Unique identifier like INCIDENT_CREATED_EMAIL

    private String subject; // Optional (mainly for email channel)

    private String body; // Template content with placeholders like ${title}

    private NotificationChannel channel;
}
