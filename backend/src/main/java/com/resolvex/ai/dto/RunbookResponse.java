package com.resolvex.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunbookResponse {

    private String id;
    private String title;
    private String uploadedBy;
    private String fileName;
    private LocalDateTime uploadDate;
    private long fileSize;
    private String contentType;
}
