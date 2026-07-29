package com.resolvex.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resolvex.ai.config.OpenAIConfig;
import com.resolvex.ai.dto.*;
import com.resolvex.ai.exception.IncidentNotFoundException;
import com.resolvex.ai.model.*;
import com.resolvex.ai.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final MongoTemplate mongoTemplate;
    private final OpenAIConfig openAIConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public IncidentServiceImpl(
            IncidentRepository incidentRepository,
            MongoTemplate mongoTemplate,
            OpenAIConfig openAIConfig,
            @Qualifier("openaiRestTemplate") RestTemplate restTemplate,
            ObjectMapper objectMapper) {
        this.incidentRepository = incidentRepository;
        this.mongoTemplate = mongoTemplate;
        this.openAIConfig = openAIConfig;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public IncidentResponse createIncident(CreateIncidentRequest request, String createdBy) {
        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .severity(request.getSeverity())
                .status(IncidentStatus.OPEN)
                .createdBy(createdBy)
                .assignedTo(request.getAssignedTo())
                .build();

        Incident saved = incidentRepository.save(incident);
        return mapToResponse(saved);
    }

    @Override
    public IncidentListResponse getAllIncidents(String title, IncidentCategory category, IncidentPriority priority,
                                                 IncidentSeverity severity, IncidentStatus status,
                                                 int pageNo, int pageSize, String sortBy, String sortDir) {
        Query query = new Query();

        if (title != null && !title.isBlank()) {
            query.addCriteria(Criteria.where("title").regex(title, "i"));
        }
        if (category != null) {
            query.addCriteria(Criteria.where("category").is(category));
        }
        if (priority != null) {
            query.addCriteria(Criteria.where("priority").is(priority));
        }
        if (severity != null) {
            query.addCriteria(Criteria.where("severity").is(severity));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }

        long totalElements = mongoTemplate.count(query, Incident.class);

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(direction, sortBy));
        query.with(pageable);

        List<Incident> incidents = mongoTemplate.find(query, Incident.class);
        List<IncidentResponse> content = incidents.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        return IncidentListResponse.builder()
                .content(content)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(pageNo >= totalPages - 1)
                .build();
    }

    @Override
    public IncidentResponse getIncidentById(String id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + id));
        return mapToResponse(incident);
    }

    @Override
    public IncidentResponse updateIncident(String id, UpdateIncidentRequest request, String currentUserEmail, boolean isAdmin) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + id));

        // Validate authorization: only creator or ADMIN can update
        if (!incident.getCreatedBy().equals(currentUserEmail) && !isAdmin) {
            throw new AccessDeniedException("You are not authorized to update this incident");
        }

        if (request.getTitle() != null) {
            incident.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            incident.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            incident.setCategory(request.getCategory());
        }
        if (request.getPriority() != null) {
            incident.setPriority(request.getPriority());
        }
        if (request.getSeverity() != null) {
            incident.setSeverity(request.getSeverity());
        }
        if (request.getStatus() != null) {
            incident.setStatus(request.getStatus());
        }
        if (request.getAssignedTo() != null) {
            incident.setAssignedTo(request.getAssignedTo());
        }

        Incident updated = incidentRepository.save(incident);
        return mapToResponse(updated);
    }

    @Override
    public void deleteIncident(String id, String currentUserEmail, boolean isAdmin) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + id));

        // Validate authorization: only creator or ADMIN can delete
        if (!incident.getCreatedBy().equals(currentUserEmail) && !isAdmin) {
            throw new AccessDeniedException("You are not authorized to delete this incident");
        }

        incidentRepository.delete(incident);
    }

    @Override
    public IncidentAnalysisResponse analyzeIncident(String id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + id));

        if (openAIConfig.getApiKey() == null || openAIConfig.getApiKey().isBlank()) {
            throw new RuntimeException("OpenAI API key is missing or not configured");
        }

        try {
            // Build prompt
            String systemInstruction = "You are an expert AI Incident Analyzer. Analyze the given incident and return a JSON object with the following fields: 'summary' (brief details), 'rootCause' (likely root cause), 'suggestedFix' (recommended immediate actions), 'preventionTips' (how to avoid it in future), 'estimatedResolutionTime' (e.g. '30 mins', '2 hours'), 'confidenceScore' (a decimal between 0.0 and 1.0). Return only the raw JSON object. Do not wrap in markdown or backticks.";
            String userContent = String.format("Title: %s\nDescription: %s\nCategory: %s\nPriority: %s\nSeverity: %s",
                    incident.getTitle(), incident.getDescription(), incident.getCategory(), incident.getPriority(), incident.getSeverity());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", openAIConfig.getModel());
            requestBody.put("temperature", 0.2);
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", systemInstruction),
                    Map.of("role", "user", "content", userContent)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody);
            ResponseEntity<Map> response = restTemplate.postForEntity(openAIConfig.getApiUrl(), entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    if (message != null) {
                        String rawContent = (String) message.get("content");
                        String cleanJson = cleanJsonContent(rawContent);

                        IncidentAnalysisResponse analysis = objectMapper.readValue(cleanJson, IncidentAnalysisResponse.class);

                        // Save analysis back to MongoDB
                        incident.setAiSummary(analysis.getSummary());
                        incident.setRootCause(analysis.getRootCause());
                        incident.setSuggestedFix(analysis.getSuggestedFix());
                        incident.setPreventionTips(analysis.getPreventionTips());
                        incident.setEstimatedResolutionTime(analysis.getEstimatedResolutionTime());
                        incident.setConfidenceScore(analysis.getConfidenceScore());
                        incidentRepository.save(incident);

                        return analysis;
                    }
                }
            }
            throw new RuntimeException("Empty or invalid response from OpenAI API");
        } catch (Exception ex) {
            throw new RuntimeException("AI Service Failure: " + ex.getMessage(), ex);
        }
    }

    private String cleanJsonContent(String rawContent) {
        if (rawContent == null) return "{}";
        String clean = rawContent.trim();
        if (clean.startsWith("```json")) {
            clean = clean.substring(7);
        } else if (clean.startsWith("```")) {
            clean = clean.substring(3);
        }
        if (clean.endsWith("```")) {
            clean = clean.substring(0, clean.length() - 3);
        }
        return clean.trim();
    }

    private IncidentResponse mapToResponse(Incident incident) {
        return IncidentResponse.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .description(incident.getDescription())
                .category(incident.getCategory())
                .priority(incident.getPriority())
                .severity(incident.getSeverity())
                .status(incident.getStatus())
                .createdBy(incident.getCreatedBy())
                .assignedTo(incident.getAssignedTo())
                .aiSummary(incident.getAiSummary())
                .rootCause(incident.getRootCause())
                .suggestedFix(incident.getSuggestedFix())
                .preventionTips(incident.getPreventionTips())
                .estimatedResolutionTime(incident.getEstimatedResolutionTime())
                .confidenceScore(incident.getConfidenceScore())
                .createdAt(incident.getCreatedAt())
                .updatedAt(incident.getUpdatedAt())
                .build();
    }
}
