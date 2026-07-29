package com.resolvex.ai.controller;

import com.resolvex.ai.dto.BackupResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.BackupService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/backup")
@PreAuthorize("hasRole('ADMIN')")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BackupResponse>> createBackup(@AuthenticationPrincipal UserDetails userDetails) {
        String adminEmail = userDetails.getUsername();
        BackupResponse response = backupService.createBackup(adminEmail);
        return ResponseEntity.ok(ApiResponse.success("Database backup executed successfully", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<BackupResponse>>> getBackupHistory() {
        List<BackupResponse> history = backupService.getBackupHistory();
        return ResponseEntity.ok(ApiResponse.success("Backup history logs retrieved successfully", history));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadBackup(@PathVariable String id) {
        byte[] fileBytes = backupService.downloadBackupFile(id);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"backup_" + id + ".json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(fileBytes);
    }
}
