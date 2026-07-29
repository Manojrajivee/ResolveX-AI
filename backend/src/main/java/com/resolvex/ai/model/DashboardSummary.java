package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "dashboard_summaries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummary {

    @Id
    private String id;

    private long totalUsers;
    
    private long totalRunbooks;
    
    private long uploadedRunbooks;
    
    private long parsedDocuments;
    
    private long totalChunks;
    
    private long vectorDatabaseSize; // simulated size in megabytes
    
    private long aiQueries;
    
    private long executionPlansGenerated;
    
    private long commandsExecuted;
    
    private long successfulCommands;
    
    private long failedCommands;
    
    private long incidentReports;
    
    private String averageResolutionTime;
    
    private List<Map<String, Object>> mostUsedRunbooks;
    
    private List<Map<String, Object>> mostExecutedCommands;

    private LocalDateTime calculatedAt;
}
