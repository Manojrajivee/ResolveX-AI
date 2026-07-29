package com.resolvex.ai.service;

import com.resolvex.ai.dto.EscalationRequest;
import com.resolvex.ai.dto.EscalationResponse;
import com.resolvex.ai.exception.IncidentNotFoundException;
import com.resolvex.ai.model.Escalation;
import com.resolvex.ai.model.Incident;
import com.resolvex.ai.model.IncidentPriority;
import com.resolvex.ai.model.IncidentSeverity;
import com.resolvex.ai.repository.EscalationRepository;
import com.resolvex.ai.repository.IncidentRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EscalationServiceImpl implements EscalationService {

    private final EscalationRepository escalationRepository;
    private final IncidentRepository incidentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public EscalationServiceImpl(
            EscalationRepository escalationRepository,
            IncidentRepository incidentRepository,
            ApplicationEventPublisher eventPublisher) {
        this.escalationRepository = escalationRepository;
        this.incidentRepository = incidentRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public EscalationResponse escalateIncident(EscalationRequest request) {
        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + request.getIncidentId()));

        Escalation escalation = Escalation.builder()
                .incidentId(request.getIncidentId())
                .level(request.getLevel())
                .reason(request.getReason())
                .assignedManager(request.getAssignedManager())
                .build();

        Escalation saved = escalationRepository.save(escalation);

        // Update incident to URGENT priority and CRITICAL severity on escalation
        incident.setPriority(IncidentPriority.URGENT);
        incident.setSeverity(IncidentSeverity.CRITICAL);
        incidentRepository.save(incident);

        // Publish event for email/slack alerts
        eventPublisher.publishEvent(saved);

        return mapToResponse(saved);
    }

    @Override
    public List<EscalationResponse> getEscalationsForIncident(String incidentId) {
        return escalationRepository.findByIncidentId(incidentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EscalationResponse> getEscalationsByManager(String managerEmail) {
        return escalationRepository.findByAssignedManager(managerEmail).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private EscalationResponse mapToResponse(Escalation escalation) {
        return EscalationResponse.builder()
                .id(escalation.getId())
                .incidentId(escalation.getIncidentId())
                .level(escalation.getLevel())
                .reason(escalation.getReason())
                .assignedManager(escalation.getAssignedManager())
                .escalatedAt(escalation.getEscalatedAt())
                .build();
    }
}
