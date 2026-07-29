package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "backup_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BackupHistory {

    @Id
    private String id;

    private String backupName;

    private String filePath;

    @CreatedDate
    private LocalDateTime createdAt;
}
