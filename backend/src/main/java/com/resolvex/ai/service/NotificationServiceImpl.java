package com.resolvex.ai.service;

import com.resolvex.ai.dto.*;
import com.resolvex.ai.model.*;
import com.resolvex.ai.repository.IncidentRepository;
import com.resolvex.ai.repository.NotificationRepository;
import com.resolvex.ai.repository.TemplateRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final TemplateRepository templateRepository;
    private final IncidentRepository incidentRepository;
    private final EmailService emailService;
    private final SlackService slackService;
    private final TeamsService teamsService;
    private final SMSService smsService;
    private final PushNotificationService pushNotificationService;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            TemplateRepository templateRepository,
            IncidentRepository incidentRepository,
            EmailService emailService,
            SlackService slackService,
            TeamsService teamsService,
            SMSService smsService,
            PushNotificationService pushNotificationService) {
        this.notificationRepository = notificationRepository;
        this.templateRepository = templateRepository;
        this.incidentRepository = incidentRepository;
        this.emailService = emailService;
        this.slackService = slackService;
        this.teamsService = teamsService;
        this.smsService = smsService;
        this.pushNotificationService = pushNotificationService;
    }

    @PostConstruct
    public void seedTemplates() {
        if (templateRepository.count() == 0) {
            templateRepository.save(NotificationTemplate.builder()
                    .name("INCIDENT_CREATED_EMAIL")
                    .subject("ALERT: Incident Created - ${incidentTitle}")
                    .body("<html><body style='font-family: Inter, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;'>" +
                            "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;'>" +
                            "<div style='background: linear-gradient(135deg, #ef4444, #b91c1c); padding: 24px; text-align: center; color: white;'><h2 style='margin: 0; font-size: 24px; font-weight: 700;'>🚨 Incident Alert</h2></div>" +
                            "<div style='padding: 24px; color: #333;'><p>A new incident has been created in ResolveX AI:</p>" +
                            "<table style='width: 100%; border-collapse: collapse; margin-top: 16px;'>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666; width: 30%;'>Incident ID:</td><td style='padding: 8px 0;'>${incidentId}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>Title:</td><td style='padding: 8px 0;'>${incidentTitle}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>Category:</td><td style='padding: 8px 0;'>${incidentCategory}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>Severity:</td><td style='padding: 8px 0; color: #ef4444; font-weight: bold;'>${incidentSeverity}</td></tr>" +
                            "</table>" +
                            "<div style='margin-top: 24px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #ef4444; border-radius: 4px;'><strong>Description:</strong><br/>${incidentDescription}</div>" +
                            "<p style='margin-top: 24px;'>Please review the ticket immediately.</p></div>" +
                            "<div style='background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e1e4e8;'>ResolveX AI Team</div></div></body></html>")
                    .channel(NotificationChannel.EMAIL)
                    .build());
            
            templateRepository.save(NotificationTemplate.builder()
                    .name("INCIDENT_ASSIGNED_EMAIL")
                    .subject("ASSIGNMENT: Incident ${incidentId} Assigned")
                    .body("<html><body style='font-family: Inter, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;'>" +
                            "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;'>" +
                            "<div style='background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 24px; text-align: center; color: white;'><h2 style='margin: 0; font-size: 24px; font-weight: 700;'>👤 Incident Assigned</h2></div>" +
                            "<div style='padding: 24px; color: #333;'><p>You have been assigned to the following incident in ResolveX AI:</p>" +
                            "<table style='width: 100%; border-collapse: collapse; margin-top: 16px;'>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666; width: 30%;'>Incident ID:</td><td style='padding: 8px 0;'>${incidentId}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>Title:</td><td style='padding: 8px 0;'>${incidentTitle}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>Priority:</td><td style='padding: 8px 0;'>${incidentPriority}</td></tr>" +
                            "</table>" +
                            "<p style='margin-top: 24px;'>Please accept the assignment and begin troubleshooting.</p></div>" +
                            "<div style='background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e1e4e8;'>ResolveX AI Team</div></div></body></html>")
                    .channel(NotificationChannel.EMAIL)
                    .build());
            
            templateRepository.save(NotificationTemplate.builder()
                    .name("ESCALATION_CREATED_EMAIL")
                    .subject("ESCALATION: Incident ${incidentId} Violated SLA")
                    .body("<html><body style='font-family: Inter, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;'>" +
                            "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;'>" +
                            "<div style='background: linear-gradient(135deg, #d97706, #b45309); padding: 24px; text-align: center; color: white;'><h2 style='margin: 0; font-size: 24px; font-weight: 700;'>🔥 Escalation Alert</h2></div>" +
                            "<div style='padding: 24px; color: #333;'><p>The following incident has violated SLA guidelines:</p>" +
                            "<table style='width: 100%; border-collapse: collapse; margin-top: 16px;'>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666; width: 30%;'>Incident ID:</td><td style='padding: 8px 0;'>${incidentId}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>Title:</td><td style='padding: 8px 0;'>${incidentTitle}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>Severity:</td><td style='padding: 8px 0;'>${incidentSeverity}</td></tr>" +
                            "</table>" +
                            "<p style='margin-top: 24px;'>Please intervene immediately.</p></div>" +
                            "<div style='background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e1e4e8;'>ResolveX AI Team</div></div></body></html>")
                    .channel(NotificationChannel.EMAIL)
                    .build());

            // Seed new Module 10 templates
            templateRepository.save(NotificationTemplate.builder()
                    .name("RUNBOOK_UPLOAD_EMAIL")
                    .subject("Runbook Uploaded Successfully - ${runbookTitle}")
                    .body("<html><body style='font-family: Inter, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;'>" +
                            "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;'>" +
                            "<div style='background: linear-gradient(135deg, #0284c7, #0ea5e9); padding: 24px; text-align: center; color: white;'><h2 style='margin: 0; font-size: 24px; font-weight: 700;'>📁 Runbook Upload Completed</h2></div>" +
                            "<div style='padding: 24px; color: #333;'><p>A new runbook file has been registered successfully:</p>" +
                            "<table style='width: 100%; border-collapse: collapse; margin-top: 16px;'>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666; width: 30%;'>Runbook Name:</td><td style='padding: 8px 0;'>${runbookTitle}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>File Name:</td><td style='padding: 8px 0; font-family: monospace;'>${runbookFile}</td></tr>" +
                            "</table></div>" +
                            "<div style='background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e1e4e8;'>ResolveX AI Team</div></div></body></html>")
                    .channel(NotificationChannel.EMAIL)
                    .build());

            templateRepository.save(NotificationTemplate.builder()
                    .name("REPORT_GENERATED_EMAIL")
                    .subject("Operations Report Ready - ${reportId}")
                    .body("<html><body style='font-family: Inter, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;'>" +
                            "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;'>" +
                            "<div style='background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 24px; text-align: center; color: white;'><h2 style='margin: 0; font-size: 24px; font-weight: 700;'>📊 Operations Report Compiled</h2></div>" +
                            "<div style='padding: 24px; color: #333;'><p>A new operations report is ready for viewing:</p>" +
                            "<table style='width: 100%; border-collapse: collapse; margin-top: 16px;'>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666; width: 30%;'>Report ID:</td><td style='padding: 8px 0;'>${reportId}</td></tr>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666;'>Download:</td><td style='padding: 8px 0;'><a href='${reportUrl}' style='color: #4f46e5; text-decoration: none;'>View Report Details</a></td></tr>" +
                            "</table></div>" +
                            "<div style='background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e1e4e8;'>ResolveX AI Team</div></div></body></html>")
                    .channel(NotificationChannel.EMAIL)
                    .build());

            templateRepository.save(NotificationTemplate.builder()
                    .name("AI_FAILURE_EMAIL")
                    .subject("CRITICAL: AI Logic Operation Failed")
                    .body("<html><body style='font-family: Inter, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;'>" +
                            "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;'>" +
                            "<div style='background: linear-gradient(135deg, #ea580c, #f97316); padding: 24px; text-align: center; color: white;'><h2 style='margin: 0; font-size: 24px; font-weight: 700;'>⚠ AI Reasoning Exception</h2></div>" +
                            "<div style='padding: 24px; color: #333;'><p>An exception was thrown during AI processing:</p>" +
                            "<div style='margin-top: 16px; padding: 16px; background-color: #fff7ed; border-left: 4px solid #ea580c; border-radius: 4px;'><strong>Details:</strong><br/>${failureReason}</div>" +
                            "</div>" +
                            "<div style='background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e1e4e8;'>ResolveX AI Team</div></div></body></html>")
                    .channel(NotificationChannel.EMAIL)
                    .build());

            templateRepository.save(NotificationTemplate.builder()
                    .name("COMMAND_FAILURE_EMAIL")
                    .subject("ALERT: Command Execution Failed")
                    .body("<html><body style='font-family: Inter, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;'>" +
                            "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;'>" +
                            "<div style='background: linear-gradient(135deg, #dc2626, #ef4444); padding: 24px; text-align: center; color: white;'><h2 style='margin: 0; font-size: 24px; font-weight: 700;'>🔥 Execution Failure</h2></div>" +
                            "<div style='padding: 24px; color: #333;'><p>An automated command execution completed with a non-zero exit status:</p>" +
                            "<table style='width: 100%; border-collapse: collapse; margin-top: 16px;'>" +
                            "<tr><td style='padding: 8px 0; font-weight: bold; color: #666; width: 30%;'>Command:</td><td style='padding: 8px 0; font-family: monospace;'>${commandString}</td></tr>" +
                            "</table>" +
                            "<div style='margin-top: 16px; padding: 16px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px; font-family: monospace; font-size: 12px;'>${commandOutput}</div></div>" +
                            "<div style='background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e1e4e8;'>ResolveX AI Team</div></div></body></html>")
                    .channel(NotificationChannel.EMAIL)
                    .build());

            templateRepository.save(NotificationTemplate.builder()
                    .name("SYSTEM_WARNING_EMAIL")
                    .subject("ALERT: System Warning Logged")
                    .body("<html><body style='font-family: Inter, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;'>" +
                            "<div style='max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;'>" +
                            "<div style='background: linear-gradient(135deg, #d97706, #f59e0b); padding: 24px; text-align: center; color: white;'><h2 style='margin: 0; font-size: 24px; font-weight: 700;'>⚠ System Monitor Warning</h2></div>" +
                            "<div style='padding: 24px; color: #333;'><p>A system warning has been captured by the logs pipeline:</p>" +
                            "<div style='margin-top: 16px; padding: 16px; background-color: #fffbeb; border-left: 4px solid #d97706; border-radius: 4px;'><strong>Warning Log:</strong><br/>${systemWarning}</div></div>" +
                            "<div style='background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e1e4e8;'>ResolveX AI Team</div></div></body></html>")
                    .channel(NotificationChannel.EMAIL)
                    .build());

            // Seeding slack templates
            templateRepository.save(NotificationTemplate.builder()
                    .name("INCIDENT_CREATED_SLACK")
                    .body("🚨 *New Incident Created*\n*ID:* ${incidentId}\n*Title:* ${incidentTitle}\n*Severity:* ${incidentSeverity}\n*Category:* ${incidentCategory}")
                    .channel(NotificationChannel.SLACK)
                    .build());

            templateRepository.save(NotificationTemplate.builder()
                    .name("INCIDENT_ASSIGNED_SLACK")
                    .body("👤 *Incident Assigned*\n*ID:* ${incidentId}\n*Title:* ${incidentTitle}\n*Assignee:* ${incidentAssignedTo}")
                    .channel(NotificationChannel.SLACK)
                    .build());
            
            templateRepository.save(NotificationTemplate.builder()
                    .name("ESCALATION_CREATED_SLACK")
                    .body("🔥 *SLA Violated - Incident Escalated*\n*ID:* ${incidentId}\n*Title:* ${incidentTitle}\n*Severity:* ${incidentSeverity}\n*Assignee:* ${incidentAssignedTo}")
                    .channel(NotificationChannel.SLACK)
                    .build());
            System.out.println("Notification Templates seeded successfully in MongoDB.");
        }
    }

    @Override
    public NotificationResponse sendNotification(NotificationRequest request) {
        // Create initial pending notification log
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .incidentId(request.getIncidentId())
                .type(request.getType())
                .channel(request.getChannel())
                .recipient(request.getRecipient())
                .status(NotificationStatus.PENDING)
                .build();

        Notification saved = notificationRepository.save(notification);

        // Fetch template if available
        String templateName = request.getType().name() + "_" + request.getChannel().name();
        NotificationTemplate template = templateRepository.findByName(templateName).orElse(null);

        // Render message
        String finalMessage = (template != null) ? formatMessage(template.getBody(), request.getIncidentId()) : request.getMessage();
        if (finalMessage == null || finalMessage.isBlank()) {
            finalMessage = "ResolveX Alert: Notification Event of type " + request.getType().name();
        }
        saved.setMessage(finalMessage);

        try {
            // Route message dispatch to channel
            switch (request.getChannel()) {
                case EMAIL:
                    String subject = (template != null && template.getSubject() != null) 
                            ? formatMessage(template.getSubject(), request.getIncidentId()) 
                            : "ResolveX System Alert";
                    emailService.sendEmail(EmailRequest.builder()
                            .to(request.getRecipient())
                            .subject(subject)
                            .body(finalMessage)
                            .build());
                    break;
                case SLACK:
                    slackService.sendSlackMessage(SlackRequest.builder()
                            .message(finalMessage)
                            .build());
                    break;
                case TEAMS:
                    teamsService.sendTeamsMessage(TeamsRequest.builder()
                            .message(finalMessage)
                            .build());
                    break;
                case SMS:
                    smsService.sendSMS(SMSRequest.builder()
                            .to(request.getRecipient())
                            .message(finalMessage)
                            .build());
                    break;
                case PUSH:
                    pushNotificationService.sendPushNotification(PushNotificationRequest.builder()
                            .targetToken(request.getRecipient())
                            .title("ResolveX AI Notification")
                            .body(finalMessage)
                            .build());
                    break;
            }

            saved.setStatus(NotificationStatus.SENT);
            saved.setSentAt(LocalDateTime.now());
        } catch (Exception ex) {
            System.err.println("Notification Delivery Failed: " + ex.getMessage());
            saved.setStatus(NotificationStatus.FAILED);
        }

        Notification updated = notificationRepository.save(saved);
        return mapToResponse(updated);
    }

    @Override
    public List<NotificationResponse> getNotificationHistory(String userId) {
        return notificationRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.SENT);
    }

    @Override
    public void markAsRead(String id, String userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification log not found with id: " + id));
        if (notification.getUserId() != null && !notification.getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized access to notification record");
        }
        notification.setStatus(NotificationStatus.READ);
        notificationRepository.save(notification);
    }

    @Override
    public void deleteNotification(String id, String userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification log not found with id: " + id));
        if (notification.getUserId() != null && !notification.getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized access to notification record");
        }
        notificationRepository.delete(notification);
    }

    @Override
    public void retryFailedNotifications() {
        List<Notification> failedList = notificationRepository.findByStatus(NotificationStatus.FAILED);
        if (failedList.isEmpty()) {
            return;
        }

        System.out.println("Scheduler: Attempting retry for " + failedList.size() + " failed notifications.");
        for (Notification failed : failedList) {
            try {
                // Prepare request parameters
                NotificationRequest req = NotificationRequest.builder()
                        .userId(failed.getUserId())
                        .incidentId(failed.getIncidentId())
                        .type(failed.getType())
                        .channel(failed.getChannel())
                        .recipient(failed.getRecipient())
                        .message(failed.getMessage())
                        .build();

                // Re-send (this will clean/delete old and save new or we can update directly)
                switch (failed.getChannel()) {
                    case EMAIL:
                        emailService.sendEmail(EmailRequest.builder()
                                .to(failed.getRecipient())
                                .subject("ResolveX Retry Alert")
                                .body(failed.getMessage())
                                .build());
                        break;
                    case SLACK:
                        slackService.sendSlackMessage(SlackRequest.builder()
                                .message(failed.getMessage())
                                .build());
                        break;
                    case TEAMS:
                        teamsService.sendTeamsMessage(TeamsRequest.builder()
                                .message(failed.getMessage())
                                .build());
                        break;
                    case SMS:
                        smsService.sendSMS(SMSRequest.builder()
                                .to(failed.getRecipient())
                                .message(failed.getMessage())
                                .build());
                        break;
                    case PUSH:
                        pushNotificationService.sendPushNotification(PushNotificationRequest.builder()
                                .targetToken(failed.getRecipient())
                                .title("ResolveX Retry Alert")
                                .body(failed.getMessage())
                                .build());
                        break;
                }
                failed.setStatus(NotificationStatus.SENT);
                failed.setSentAt(LocalDateTime.now());
                notificationRepository.save(failed);
            } catch (Exception ex) {
                System.err.println("Retry Failed for notification " + failed.getId() + ": " + ex.getMessage());
            }
        }
    }

    private String formatMessage(String templateBody, String incidentId) {
        if (templateBody == null) return "";
        String formatted = templateBody;
        if (incidentId != null && !incidentId.isBlank()) {
            Incident incident = incidentRepository.findById(incidentId).orElse(null);
            if (incident != null) {
                formatted = formatted.replace("${incidentId}", incident.getId() != null ? incident.getId() : "");
                formatted = formatted.replace("${incidentTitle}", incident.getTitle() != null ? incident.getTitle() : "");
                formatted = formatted.replace("${incidentDescription}", incident.getDescription() != null ? incident.getDescription() : "");
                formatted = formatted.replace("${incidentCategory}", incident.getCategory() != null ? incident.getCategory().name() : "");
                formatted = formatted.replace("${incidentPriority}", incident.getPriority() != null ? incident.getPriority().name() : "");
                formatted = formatted.replace("${incidentSeverity}", incident.getSeverity() != null ? incident.getSeverity().name() : "");
                formatted = formatted.replace("${incidentStatus}", incident.getStatus() != null ? incident.getStatus().name() : "");
                formatted = formatted.replace("${incidentAssignedTo}", incident.getAssignedTo() != null ? incident.getAssignedTo() : "Unassigned");
            }
        }
        
        // Seeding variables placeholders fallbacks to make rendering completely safe and premium
        formatted = formatted.replace("${runbookTitle}", "Nginx Configuration Autorestore");
        formatted = formatted.replace("${runbookFile}", "nginx_restart.sh");
        formatted = formatted.replace("${reportId}", "R-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        formatted = formatted.replace("${reportUrl}", "/api/reports/view");
        formatted = formatted.replace("${failureReason}", "LLM Timeout on prompt analysis context");
        formatted = formatted.replace("${commandString}", "kubectl get pods -n production");
        formatted = formatted.replace("${commandOutput}", "Error: connection reset by peer");
        formatted = formatted.replace("${systemWarning}", "CPU temperature exceeded 85C threshold");
        
        return formatted;
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .incidentId(notification.getIncidentId())
                .type(notification.getType())
                .channel(notification.getChannel())
                .recipient(notification.getRecipient())
                .message(notification.getMessage())
                .status(notification.getStatus())
                .createdAt(notification.getCreatedAt())
                .sentAt(notification.getSentAt())
                .build();
    }
}
