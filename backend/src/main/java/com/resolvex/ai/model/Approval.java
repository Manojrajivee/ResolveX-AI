package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "approvals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Approval {

    @Id
    private String id;

    private String workflowId;

    private String approverId; // Manager's email

    @Builder.Default
    private ApprovalStatus status = ApprovalStatus.PENDING;

    private String comments;

    private LocalDateTime approvedAt;
}
