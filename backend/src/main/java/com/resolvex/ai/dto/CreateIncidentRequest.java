package com.resolvex.ai.dto;

import com.resolvex.ai.model.IncidentCategory;
import com.resolvex.ai.model.IncidentPriority;
import com.resolvex.ai.model.IncidentSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateIncidentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private IncidentCategory category;

    @NotNull(message = "Priority is required")
    private IncidentPriority priority;

    @NotNull(message = "Severity is required")
    private IncidentSeverity severity;

    private String assignedTo;
}
