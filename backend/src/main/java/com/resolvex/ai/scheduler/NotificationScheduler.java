package com.resolvex.ai.scheduler;

import com.resolvex.ai.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationScheduler {

    private final NotificationService notificationService;

    public NotificationScheduler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 0/5 * * * *") // Run every 5 minutes
    public void retryFailedAlerts() {
        try {
            notificationService.retryFailedNotifications();
        } catch (Exception ex) {
            System.err.println("Scheduler: Failed to run notification retry job: " + ex.getMessage());
        }
    }
}
