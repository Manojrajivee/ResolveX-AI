package com.resolvex.ai.service;

import com.resolvex.ai.dto.LogResponse;

import java.util.List;

public interface LogService {
    
    void log(String level, String source, String message);
    
    void logExecution(String command, String output, String status);
    
    List<LogResponse> getAllLogs();
    
    LogResponse getLogById(String id);
}
