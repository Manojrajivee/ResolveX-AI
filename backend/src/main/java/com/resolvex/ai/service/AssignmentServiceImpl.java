package com.resolvex.ai.service;

import com.resolvex.ai.dto.AssignmentRequest;
import com.resolvex.ai.dto.AssignmentResponse;
import com.resolvex.ai.exception.AssignmentException;
import com.resolvex.ai.exception.IncidentNotFoundException;
import com.resolvex.ai.model.*;
import com.resolvex.ai.repository.AssignmentRepository;
import com.resolvex.ai.repository.IncidentRepository;
import com.resolvex.ai.repository.UserRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final IncidentRepository incidentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public AssignmentServiceImpl(
            AssignmentRepository assignmentRepository,
            UserRepository userRepository,
            IncidentRepository incidentRepository,
            ApplicationEventPublisher eventPublisher) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.incidentRepository = incidentRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public AssignmentResponse assignIncident(AssignmentRequest request) {
        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + request.getIncidentId()));

        User engineer = userRepository.findByEmail(request.getEngineerId())
                .orElseThrow(() -> new AssignmentException("Engineer not found with email: " + request.getEngineerId()));

        if (engineer.getRole() != Role.ENGINEER && engineer.getRole() != Role.ADMIN) {
            throw new AssignmentException("Specified user is not an engineer or admin");
        }

        Assignment assignment = Assignment.builder()
                .incidentId(request.getIncidentId())
                .engineerId(request.getEngineerId())
                .recommendedByAI(request.isRecommendedByAI())
                .deadline(request.getDeadline())
                .status(AssignmentStatus.ASSIGNED)
                .build();

        Assignment saved = assignmentRepository.save(assignment);

        // Update incident's assignment properties
        incident.setAssignedTo(request.getEngineerId());
        incident.setStatus(IncidentStatus.IN_PROGRESS);
        incidentRepository.save(incident);

        // Publish Assignment Event for notification delivery
        eventPublisher.publishEvent(saved);

        return mapToResponse(saved);
    }

    @Override
    public String recommendEngineer(String incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + incidentId));

        List<User> engineers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ENGINEER)
                .collect(Collectors.toList());

        if (engineers.isEmpty()) {
            return "manager@resolvex.ai"; // fallback
        }

        User bestEngineer = null;
        double maxScore = -999.0;

        for (User eng : engineers) {
            double score = 10.0; // Base score

            // 1. Workload Penalty: Deduct points for active assignments
            long activeCount = assignmentRepository.findByEngineerId(eng.getEmail()).stream()
                    .filter(a -> a.getStatus() == AssignmentStatus.ASSIGNED || a.getStatus() == AssignmentStatus.IN_PROGRESS)
                    .count();
            score -= activeCount * 2.0; // Deduct 2.0 points per active ticket

            // 2. Expertise Bonus: Add points for resolved tickets in the same category
            List<Assignment> resolvedAssignments = assignmentRepository.findByEngineerId(eng.getEmail()).stream()
                    .filter(a -> a.getStatus() == AssignmentStatus.COMPLETED)
                    .collect(Collectors.toList());

            for (Assignment resolved : resolvedAssignments) {
                Incident pastIncident = incidentRepository.findById(resolved.getIncidentId()).orElse(null);
                if (pastIncident != null && pastIncident.getCategory() == incident.getCategory()) {
                    score += 3.0; // Add 3.0 points per resolved ticket of same category
                }
            }

            if (score > maxScore) {
                maxScore = score;
                bestEngineer = eng;
            }
        }

        return bestEngineer != null ? bestEngineer.getEmail() : "manager@resolvex.ai";
    }

    @Override
    public List<AssignmentResponse> getAssignmentsByEngineer(String engineerId) {
        return assignmentRepository.findByEngineerId(engineerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentResponse acceptAssignment(String assignmentId, String engineerId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AssignmentException("Assignment not found with id: " + assignmentId));

        if (!assignment.getEngineerId().equals(engineerId)) {
            throw new AccessDeniedException("You are not authorized to accept this assignment");
        }

        assignment.setStatus(AssignmentStatus.ACCEPTED);
        Assignment updated = assignmentRepository.save(assignment);
        return mapToResponse(updated);
    }

    @Override
    public AssignmentResponse updateAssignmentStatus(String assignmentId, AssignmentStatus status, String engineerId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AssignmentException("Assignment not found with id: " + assignmentId));

        if (!assignment.getEngineerId().equals(engineerId)) {
            throw new AccessDeniedException("You are not authorized to update this assignment");
        }

        assignment.setStatus(status);
        Assignment updated = assignmentRepository.save(assignment);

        // If assignment is completed, mark the associated incident as RESOLVED
        if (status == AssignmentStatus.COMPLETED) {
            incidentRepository.findById(assignment.getIncidentId()).ifPresent(incident -> {
                incident.setStatus(IncidentStatus.RESOLVED);
                incidentRepository.save(incident);
                
                // Publish completion event for incident resolution notification
                eventPublisher.publishEvent(incident);
            });
        }

        return mapToResponse(updated);
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .incidentId(assignment.getIncidentId())
                .engineerId(assignment.getEngineerId())
                .recommendedByAI(assignment.isRecommendedByAI())
                .assignedAt(assignment.getAssignedAt())
                .deadline(assignment.getDeadline())
                .status(assignment.getStatus())
                .build();
    }
}
