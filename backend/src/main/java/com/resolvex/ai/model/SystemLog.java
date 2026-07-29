package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "system_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemLog {

    @Id
    private String id;
    
    private String level; // INFO, WARN, ERROR
    
    private String source; // e.g. AUTH, RUNBOOK_UPLOAD, AI, SECURITY
    
    private String message;
    
    @CreatedDate
    private LocalDateTime timestamp;
}
