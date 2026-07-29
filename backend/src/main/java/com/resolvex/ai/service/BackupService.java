package com.resolvex.ai.service;

import com.resolvex.ai.dto.BackupResponse;

import java.util.List;

public interface BackupService {
    
    BackupResponse createBackup(String adminEmail);
    
    List<BackupResponse> getBackupHistory();
    
    byte[] downloadBackupFile(String id);
}
