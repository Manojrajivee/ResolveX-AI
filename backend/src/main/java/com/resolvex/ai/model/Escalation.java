package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "escalations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Escalation {

    @Id
    private String id;

    private String incidentId;

    @Builder.Default
    private EscalationLevel level = EscalationLevel.LEVEL_1;

    private String reason;

    private String assignedManager; // Manager's email

    @CreatedDate
    private LocalDateTime escalatedAt;
}
