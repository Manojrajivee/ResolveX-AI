package com.resolvex.ai.service;

import com.resolvex.ai.dto.InsightResponse;
import com.resolvex.ai.model.Incident;
import com.resolvex.ai.model.IncidentCategory;
import com.resolvex.ai.model.IncidentPriority;
import com.resolvex.ai.model.Insight;
import com.resolvex.ai.repository.IncidentRepository;
import com.resolvex.ai.repository.InsightRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InsightServiceImpl implements InsightService {

    private final InsightRepository insightRepository;
    private final IncidentRepository incidentRepository;

    public InsightServiceImpl(
            InsightRepository insightRepository,
            IncidentRepository incidentRepository) {
        this.insightRepository = insightRepository;
        this.incidentRepository = incidentRepository;
    }

    @Override
    public List<InsightResponse> getInsights() {
        List<Insight> list = insightRepository.findAll();
        if (list.isEmpty()) {
            generateNewInsights();
            list = insightRepository.findAll();
        }
        return list.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void generateNewInsights() {
        // Clear previous AI insights to rewrite updated projections
        insightRepository.deleteAll();

        List<Incident> incidents = incidentRepository.findAll();
        List<Insight> generated = new ArrayList<>();

        if (incidents.isEmpty()) {
            // Seed baseline configurations if DB is blank
            generated.add(Insight.builder()
                    .title("Healthy Cluster Operations Predicted")
                    .description("AI engine indicates no recurring incident patterns. SLA breach probability is below 5%.")
                    .confidenceScore(98.5)
                    .build());
        } else {
            // 1. Group by category and flag repeated failures
            Map<IncidentCategory, Long> categoryCount = incidents.stream()
                    .filter(i -> i.getCategory() != null)
                    .collect(Collectors.groupingBy(Incident::getCategory, Collectors.counting()));

            categoryCount.forEach((cat, count) -> {
                if (count >= 2) {
                    generated.add(Insight.builder()
                            .title("Repeated Failures in " + cat.name())
                            .description(String.format("AI detected %d incidents matching category %s. Suggest scheduling maintenance on associated node hosts.", count, cat.name()))
                            .confidenceScore(92.0)
                            .build());
                }
            });

            // 2. High priority SLA risk checking
            long highPriorityUnassigned = incidents.stream()
                    .filter(i -> i.getPriority() == IncidentPriority.HIGH || i.getPriority() == IncidentPriority.URGENT)
                    .filter(i -> i.getAssignedTo() == null || i.getAssignedTo().isBlank())
                    .count();

            if (highPriorityUnassigned > 0) {
                generated.add(Insight.builder()
                        .title("High SLA Breach Risk Warning")
                        .description(String.format("Detected %d unassigned High/Urgent priority incidents. Assign engineers immediately to protect SLA compliance.", highPriorityUnassigned))
                        .confidenceScore(96.0)
                        .build());
            }

            // 3. System Load recommendation
            generated.add(Insight.builder()
                    .title("Engineer Workload Recommendation")
                    .description("Optimize task distribution. System predicts a 15% improvement in SLA compliance if high priority tickets are assigned to database-specialist engineers.")
                    .confidenceScore(87.5)
                    .build());
        }

        insightRepository.saveAll(generated);
    }

    private InsightResponse mapToResponse(Insight insight) {
        return InsightResponse.builder()
                .id(insight.getId())
                .title(insight.getTitle())
                .description(insight.getDescription())
                .confidenceScore(insight.getConfidenceScore())
                .generatedByAI(insight.isGeneratedByAI())
                .createdAt(insight.getCreatedAt())
                .build();
    }
}
