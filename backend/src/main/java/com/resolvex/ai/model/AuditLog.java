package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    private String id;

    private String userId; // User email who took the action

    private String action; // e.g. "USER_DEACTIVATED"

    private String module; // e.g. "ADMIN_PANEL"

    private String ipAddress;

    private String browser;

    @CreatedDate
    private LocalDateTime createdAt;
}
