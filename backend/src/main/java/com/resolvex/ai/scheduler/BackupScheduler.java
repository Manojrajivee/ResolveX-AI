package com.resolvex.ai.scheduler;

import com.resolvex.ai.config.BackupConfig;
import com.resolvex.ai.service.BackupService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BackupScheduler {

    private final BackupService backupService;
    private final BackupConfig backupConfig;

    public BackupScheduler(BackupService backupService, BackupConfig backupConfig) {
        this.backupService = backupService;
        this.backupConfig = backupConfig;
    }

    @Scheduled(cron = "${app.backup.cron:0 0 2 * * ?}")
    public void executeScheduledBackup() {
        if (backupConfig.isEnabled()) {
            try {
                backupService.createBackup("SYSTEM_SCHEDULER");
                System.out.println("Scheduler: Automatic database backup executed successfully.");
            } catch (Exception ex) {
                System.err.println("Scheduler: Scheduled database backup trigger failed: " + ex.getMessage());
            }
        }
    }
}
