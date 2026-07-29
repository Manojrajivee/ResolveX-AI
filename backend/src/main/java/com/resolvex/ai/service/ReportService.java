package com.resolvex.ai.service;

import com.resolvex.ai.dto.GenerateReportRequest;
import com.resolvex.ai.dto.ReportResponse;
import com.resolvex.ai.dto.ReportSummaryResponse;
import com.resolvex.ai.model.ReportFormat;

import java.util.List;

public interface ReportService {

    ReportResponse generateReport(GenerateReportRequest request, String userEmail);

    List<ReportSummaryResponse> getAllReports(String userEmail, String userRole);

    ReportResponse getReportById(String id, String userEmail, String userRole);

    void deleteReport(String id, String userEmail, String userRole);

    byte[] downloadReport(String id, String userEmail, String userRole, ReportFormat format);
}
