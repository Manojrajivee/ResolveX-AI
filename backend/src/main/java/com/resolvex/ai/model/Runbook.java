package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "runbooks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Runbook {

    @Id
    private String id;

    private String title;

    private String uploadedBy;

    private String fileName;

    @CreatedDate
    private LocalDateTime uploadDate;

    private String filePath;

    private long fileSize;

    private String contentType;
}
