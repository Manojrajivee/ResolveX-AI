package com.resolvex.ai.scheduler;

import com.resolvex.ai.config.WorkflowConfig;
import com.resolvex.ai.dto.EscalationRequest;
import com.resolvex.ai.model.Assignment;
import com.resolvex.ai.model.AssignmentStatus;
import com.resolvex.ai.model.Escalation;
import com.resolvex.ai.model.EscalationLevel;
import com.resolvex.ai.repository.AssignmentRepository;
import com.resolvex.ai.repository.EscalationRepository;
import com.resolvex.ai.service.EscalationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class EscalationScheduler {

    private final AssignmentRepository assignmentRepository;
    private final EscalationRepository escalationRepository;
    private final EscalationService escalationService;
    private final WorkflowConfig workflowConfig;

    public EscalationScheduler(
            AssignmentRepository assignmentRepository,
            EscalationRepository escalationRepository,
            EscalationService escalationService,
            WorkflowConfig workflowConfig) {
        this.assignmentRepository = assignmentRepository;
        this.escalationRepository = escalationRepository;
        this.escalationService = escalationService;
        this.workflowConfig = workflowConfig;
    }

    @Scheduled(cron = "0 * * * * *") // Run every minute
    public void checkViolatedDeadlinesAndEscalate() {
        LocalDateTime now = LocalDateTime.now();

        List<Assignment> activeAssignments = new ArrayList<>();
        activeAssignments.addAll(assignmentRepository.findByStatus(AssignmentStatus.ASSIGNED));
        activeAssignments.addAll(assignmentRepository.findByStatus(AssignmentStatus.ACCEPTED));
        activeAssignments.addAll(assignmentRepository.findByStatus(AssignmentStatus.IN_PROGRESS));

        for (Assignment assignment : activeAssignments) {
            if (assignment.getDeadline() != null && assignment.getDeadline().isBefore(now)) {
                // Check if this incident has already been escalated
                List<Escalation> existingEscalations = escalationRepository.findByIncidentId(assignment.getIncidentId());
                if (existingEscalations.isEmpty()) {
                    // Create an auto-escalation to LEVEL_1
                    EscalationRequest request = EscalationRequest.builder()
                            .incidentId(assignment.getIncidentId())
                            .level(EscalationLevel.LEVEL_1)
                            .reason("Auto-Escalation: Assignment deadline exceeded. Engineer: " + assignment.getEngineerId())
                            .assignedManager(workflowConfig.getDefaultEscalationManager())
                            .build();

                    try {
                        escalationService.escalateIncident(request);
                        System.out.println("Scheduler: Successfully escalated incident " + assignment.getIncidentId() + " to LEVEL_1.");
                    } catch (Exception ex) {
                        System.err.println("Scheduler: Failed to auto-escalate incident " + assignment.getIncidentId() + ": " + ex.getMessage());
                    }
                }
            }
        }
    }
}
