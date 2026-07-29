package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "insights")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insight {

    @Id
    private String id;

    private String title;

    private String description;

    @Builder.Default
    private double confidenceScore = 95.0;

    @Builder.Default
    private boolean generatedByAI = true;

    @CreatedDate
    private LocalDateTime createdAt;
}
