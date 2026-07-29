package com.resolvex.ai.controller;

import com.resolvex.ai.dto.LogResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.LogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@PreAuthorize("hasRole('ADMIN')")
public class LogController {

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LogResponse>>> getAllLogs() {
        List<LogResponse> logs = logService.getAllLogs();
        return ResponseEntity.ok(ApiResponse.success("Logs retrieved successfully", logs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LogResponse>> getLogById(@PathVariable String id) {
        LogResponse log = logService.getLogById(id);
        return ResponseEntity.ok(ApiResponse.success("Log entry retrieved successfully", log));
    }
}
