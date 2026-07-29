package com.resolvex.ai.dto;

import com.resolvex.ai.model.NotificationChannel;
import com.resolvex.ai.model.NotificationStatus;
import com.resolvex.ai.model.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private String id;
    
    private String userId;
    
    private String incidentId;
    
    private NotificationType type;
    
    private NotificationChannel channel;
    
    private String recipient;
    
    private String message;
    
    private NotificationStatus status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime sentAt;
}
