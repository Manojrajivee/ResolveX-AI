package com.resolvex.ai.service;

import com.resolvex.ai.config.BackupConfig;
import com.resolvex.ai.dto.BackupResponse;
import com.resolvex.ai.exception.BackupException;
import com.resolvex.ai.model.BackupHistory;
import com.resolvex.ai.repository.BackupRepository;
import com.resolvex.ai.repository.IncidentRepository;
import com.resolvex.ai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BackupServiceImpl implements BackupService {

    private final BackupRepository backupRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final BackupConfig backupConfig;
    private final AuditService auditService;

    public BackupServiceImpl(
            BackupRepository backupRepository,
            IncidentRepository incidentRepository,
            UserRepository userRepository,
            BackupConfig backupConfig,
            AuditService auditService) {
        this.backupRepository = backupRepository;
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.backupConfig = backupConfig;
        this.auditService = auditService;
    }

    @Override
    public BackupResponse createBackup(String adminEmail) {
        try {
            File dir = new File(backupConfig.getBackupDirectory());
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String filename = "backup_" + System.currentTimeMillis() + ".json";
            File file = new File(dir, filename);

            // Assemble simple database metrics JSON payload
            String backupContent = String.format(
                    "{\"timestamp\":\"%s\",\"incidentsCount\":%d,\"usersCount\":%d,\"backupName\":\"%s\"}",
                    LocalDateTime.now(),
                    incidentRepository.count(),
                    userRepository.count(),
                    filename
            );

            Files.writeString(file.toPath(), backupContent);

            BackupHistory backupHistory = BackupHistory.builder()
                    .backupName(filename)
                    .filePath(file.getAbsolutePath())
                    .build();

            BackupHistory saved = backupRepository.save(backupHistory);

            auditService.logAction(adminEmail, "BACKUP_CREATED: " + filename, "BACKUP_SYSTEM", "0.0.0.0", "Internal");

            return mapToResponse(saved);
        } catch (Exception ex) {
            throw new BackupException("Failed to execute database backup: " + ex.getMessage());
        }
    }

    @Override
    public List<BackupResponse> getBackupHistory() {
        return backupRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] downloadBackupFile(String id) {
        BackupHistory backup = backupRepository.findById(id)
                .orElseThrow(() -> new BackupException("Backup history not found with id: " + id));

        try {
            File file = new File(backup.getFilePath());
            if (!file.exists()) {
                throw new BackupException("Backup file does not exist on disk: " + backup.getFilePath());
            }
            return Files.readAllBytes(file.toPath());
        } catch (Exception ex) {
            throw new BackupException("Failed to read backup file bytes: " + ex.getMessage());
        }
    }

    private BackupResponse mapToResponse(BackupHistory backup) {
        return BackupResponse.builder()
                .id(backup.getId())
                .backupName(backup.getBackupName())
                .filePath(backup.getFilePath())
                .createdAt(backup.getCreatedAt())
                .build();
    }
}
