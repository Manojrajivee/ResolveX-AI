package com.resolvex.ai.event;

import com.resolvex.ai.dto.NotificationRequest;
import com.resolvex.ai.model.*;
import com.resolvex.ai.service.NotificationService;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    private final NotificationService notificationService;

    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @EventListener
    public void handleAssignmentEvent(Assignment assignment) {
        // 1. Notify engineer via Email
        NotificationRequest emailRequest = NotificationRequest.builder()
                .userId(assignment.getEngineerId())
                .incidentId(assignment.getIncidentId())
                .type(NotificationType.INCIDENT_ASSIGNED)
                .channel(NotificationChannel.EMAIL)
                .recipient(assignment.getEngineerId())
                .build();
        notificationService.sendNotification(emailRequest);

        // 2. Notify team via Slack
        NotificationRequest slackRequest = NotificationRequest.builder()
                .userId("team")
                .incidentId(assignment.getIncidentId())
                .type(NotificationType.INCIDENT_ASSIGNED)
                .channel(NotificationChannel.SLACK)
                .recipient("general-alerts")
                .build();
        notificationService.sendNotification(slackRequest);
    }

    @EventListener
    public void handleWorkflowEvent(Workflow workflow) {
        // Notify managers that a workflow was created
        NotificationRequest emailRequest = NotificationRequest.builder()
                .userId("managers")
                .incidentId(workflow.getIncidentId())
                .type(NotificationType.WORKFLOW_CREATED)
                .channel(NotificationChannel.EMAIL)
                .recipient("manager@resolvex.ai")
                .build();
        notificationService.sendNotification(emailRequest);
    }

    @EventListener
    public void handleEscalationEvent(Escalation escalation) {
        // 1. Email the assigned manager
        NotificationRequest emailRequest = NotificationRequest.builder()
                .userId(escalation.getAssignedManager())
                .incidentId(escalation.getIncidentId())
                .type(NotificationType.ESCALATION_CREATED)
                .channel(NotificationChannel.EMAIL)
                .recipient(escalation.getAssignedManager())
                .build();
        notificationService.sendNotification(emailRequest);

        // 2. Post escalation alert on Slack
        NotificationRequest slackRequest = NotificationRequest.builder()
                .userId("managers")
                .incidentId(escalation.getIncidentId())
                .type(NotificationType.ESCALATION_CREATED)
                .channel(NotificationChannel.SLACK)
                .recipient("escalation-alerts")
                .build();
        notificationService.sendNotification(slackRequest);
    }

    @EventListener
    public void handleIncidentEvent(Incident incident) {
        if (incident.getStatus() == IncidentStatus.RESOLVED) {
            // Notify creator that the incident is resolved
            NotificationRequest emailRequest = NotificationRequest.builder()
                    .userId(incident.getCreatedBy())
                    .incidentId(incident.getId())
                    .type(NotificationType.INCIDENT_RESOLVED)
                    .channel(NotificationChannel.EMAIL)
                    .recipient(incident.getCreatedBy())
                    .build();
            notificationService.sendNotification(emailRequest);
        }
    }
}
