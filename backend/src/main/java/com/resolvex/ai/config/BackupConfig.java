package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BackupConfig {

    @Value("${app.backup.cron:0 0 2 * * ?}")
    private String cronExpression;

    @Value("${app.backup.enabled:true}")
    private boolean enabled;

    @Value("${app.backup.dir:./backups}")
    private String backupDirectory;

    public String getCronExpression() {
        return cronExpression;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getBackupDirectory() {
        return backupDirectory;
    }
}
