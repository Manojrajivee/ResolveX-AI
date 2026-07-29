package com.resolvex.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Problem description is required")
    private String problem;

    @NotBlank(message = "Solution description is required")
    private String solution;

    private List<String> keywords;

    private String incidentId;
}
