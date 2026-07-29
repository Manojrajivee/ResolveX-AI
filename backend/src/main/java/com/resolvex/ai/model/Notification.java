package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private String userId; // Recipient user email or ID

    private String incidentId;

    private NotificationType type;

    private NotificationChannel channel;

    private String recipient; // email address, webhook URL, phone number, or FCM token

    private String message;

    @Builder.Default
    private NotificationStatus status = NotificationStatus.PENDING;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime sentAt;
}
