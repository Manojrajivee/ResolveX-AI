package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {

    @Id
    private String id;

    private String incidentId;

    private String engineerId; // Engineer's email

    private boolean recommendedByAI;

    @CreatedDate
    private LocalDateTime assignedAt;

    private LocalDateTime deadline;

    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.ASSIGNED;
}
