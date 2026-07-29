package com.resolvex.ai.service;

import com.resolvex.ai.dto.LogResponse;
import com.resolvex.ai.model.ExecutionLog;
import com.resolvex.ai.model.SystemLog;
import com.resolvex.ai.repository.ExecutionLogRepository;
import com.resolvex.ai.repository.LogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogServiceImpl implements LogService {

    private final LogRepository logRepository;
    private final ExecutionLogRepository executionLogRepository;

    public LogServiceImpl(LogRepository logRepository, ExecutionLogRepository executionLogRepository) {
        this.logRepository = logRepository;
        this.executionLogRepository = executionLogRepository;
    }

    @Override
    public void log(String level, String source, String message) {
        SystemLog systemLog = SystemLog.builder()
                .level(level != null ? level.toUpperCase() : "INFO")
                .source(source != null ? source.toUpperCase() : "SYSTEM")
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        logRepository.save(systemLog);
        System.out.println(String.format("SYSTEM_LOG [%s | %s] - %s", level, source, message));
    }

    @Override
    public void logExecution(String command, String output, String status) {
        ExecutionLog executionLog = ExecutionLog.builder()
                .command(command)
                .output(output)
                .status(status != null ? status.toUpperCase() : "SUCCESS")
                .timestamp(LocalDateTime.now())
                .build();
        executionLogRepository.save(executionLog);
        System.out.println(String.format("EXECUTION_LOG - Command: %s | Status: %s", command, status));
    }

    @Override
    public List<LogResponse> getAllLogs() {
        List<LogResponse> responses = new ArrayList<>();

        List<SystemLog> systemLogs = logRepository.findAll();
        systemLogs.forEach(sl -> responses.add(LogResponse.builder()
                .id(sl.getId())
                .logType("SYSTEM")
                .level(sl.getLevel())
                .source(sl.getSource())
                .message(sl.getMessage())
                .timestamp(sl.getTimestamp())
                .build()));

        List<ExecutionLog> executionLogs = executionLogRepository.findAll();
        executionLogs.forEach(el -> responses.add(LogResponse.builder()
                .id(el.getId())
                .logType("EXECUTION")
                .level(el.getStatus())
                .source(el.getCommand())
                .message(el.getOutput())
                .timestamp(el.getTimestamp())
                .build()));

        return responses.stream()
                .sorted(Comparator.comparing(LogResponse::getTimestamp).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public LogResponse getLogById(String id) {
        SystemLog sl = logRepository.findById(id).orElse(null);
        if (sl != null) {
            return LogResponse.builder()
                    .id(sl.getId())
                    .logType("SYSTEM")
                    .level(sl.getLevel())
                    .source(sl.getSource())
                    .message(sl.getMessage())
                    .timestamp(sl.getTimestamp())
                    .build();
        }

        ExecutionLog el = executionLogRepository.findById(id).orElse(null);
        if (el != null) {
            return LogResponse.builder()
                    .id(el.getId())
                    .logType("EXECUTION")
                    .level(el.getStatus())
                    .source(el.getCommand())
                    .message(el.getOutput())
                    .timestamp(el.getTimestamp())
                    .build();
        }

        throw new com.resolvex.ai.exception.LoggingException("Log entry not found with id: " + id);
    }
}
