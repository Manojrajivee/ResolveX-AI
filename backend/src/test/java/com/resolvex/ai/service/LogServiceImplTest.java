package com.resolvex.ai.service;

import com.resolvex.ai.dto.LogResponse;
import com.resolvex.ai.model.ExecutionLog;
import com.resolvex.ai.model.SystemLog;
import com.resolvex.ai.repository.ExecutionLogRepository;
import com.resolvex.ai.repository.LogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class LogServiceImplTest {

    @Mock
    private LogRepository logRepository;

    @Mock
    private ExecutionLogRepository executionLogRepository;

    private LogServiceImpl logService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        logService = new LogServiceImpl(logRepository, executionLogRepository);
    }

    @Test
    public void testLogSystemEvent() {
        logService.log("INFO", "AUTH", "User logged in");
        verify(logRepository).save(any(SystemLog.class));
    }

    @Test
    public void testLogExecutionEvent() {
        logService.logExecution("ls -la", "total 0", "SUCCESS");
        verify(executionLogRepository).save(any(ExecutionLog.class));
    }

    @Test
    public void testGetAllLogs() {
        when(logRepository.findAll()).thenReturn(List.of(
                SystemLog.builder().id("log1").level("INFO").source("API").message("test info").timestamp(LocalDateTime.now().minusMinutes(5)).build()
        ));
        when(executionLogRepository.findAll()).thenReturn(List.of(
                ExecutionLog.builder().id("log2").command("cat file").output("success output").status("SUCCESS").timestamp(LocalDateTime.now()).build()
        ));

        List<LogResponse> logs = logService.getAllLogs();
        assertEquals(2, logs.size());
        assertEquals("EXECUTION", logs.get(0).getLogType()); // Newer logs sorted first
        assertEquals("SYSTEM", logs.get(1).getLogType());
    }

    @Test
    public void testGetLogById() {
        when(logRepository.findById("log1")).thenReturn(Optional.of(
                SystemLog.builder().id("log1").level("INFO").source("API").message("test message").timestamp(LocalDateTime.now()).build()
        ));

        LogResponse log = logService.getLogById("log1");
        assertNotNull(log);
        assertEquals("SYSTEM", log.getLogType());
        assertEquals("test message", log.getMessage());
    }
}
