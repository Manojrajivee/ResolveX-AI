package com.resolvex.ai.service;

import com.resolvex.ai.dto.GenerateReportRequest;
import com.resolvex.ai.model.ReportStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;

@SpringBootTest
public class ReportTest {

    @Autowired
    private ReportService reportService;

    @Test
    public void testGenerate() {
        try {
            GenerateReportRequest request = GenerateReportRequest.builder()
                    .incidentId("6a6a0e29de70f132b8291ffb")
                    .runbookId("64fae7890b1234567890cdef")
                    .commandsExecuted(List.of("systemctl status mysql"))
                    .commandOutputs(List.of("mysql is active (running)"))
                    .title("MySQL Database incident")
                    .problemStatement("Connection Refused")
                    .aiAnalysis("Stale lock file found")
                    .resolutionSteps(List.of("Deleted stale lock file"))
                    .status(ReportStatus.SUCCESS)
                    .build();
            
            reportService.generateReport(request, "manoj@resolvex.ai");
            System.out.println("TEST SUCCESS: Report generated!");
        } catch (Exception e) {
            System.out.println("TEST FAILURE: Exception thrown:");
            e.printStackTrace();
        }
    }
}
