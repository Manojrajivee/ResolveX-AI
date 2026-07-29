package com.resolvex.ai.service;

import com.resolvex.ai.dto.GenerateReportRequest;
import com.resolvex.ai.dto.ReportResponse;
import com.resolvex.ai.dto.ReportSummaryResponse;
import com.resolvex.ai.exception.IncidentNotFoundException;
import com.resolvex.ai.exception.PermissionException;
import com.resolvex.ai.exception.ReportException;
import com.resolvex.ai.exception.ReportNotFoundException;
import com.resolvex.ai.model.Incident;
import com.resolvex.ai.model.IncidentReport;
import com.resolvex.ai.model.ReportFormat;
import com.resolvex.ai.model.Runbook;
import com.resolvex.ai.model.User;
import com.resolvex.ai.repository.IncidentRepository;
import com.resolvex.ai.repository.ReportRepository;
import com.resolvex.ai.repository.RunbookRepository;
import com.resolvex.ai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final IncidentRepository incidentRepository;
    private final RunbookRepository runbookRepository;
    private final UserRepository userRepository;
    private final ExportService exportService;

    public ReportServiceImpl(
            ReportRepository reportRepository,
            IncidentRepository incidentRepository,
            RunbookRepository runbookRepository,
            UserRepository userRepository,
            ExportService exportService) {
        this.reportRepository = reportRepository;
        this.incidentRepository = incidentRepository;
        this.runbookRepository = runbookRepository;
        this.userRepository = userRepository;
        this.exportService = exportService;
    }

    @Override
    public ReportResponse generateReport(GenerateReportRequest request, String userEmail) {
        // Resolve User
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ReportException("User not found with email: " + userEmail));

        // Resolve Incident
        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with ID: " + request.getIncidentId()));

        // Resolve Runbook
        Runbook runbook = runbookRepository.findById(request.getRunbookId())
                .orElseThrow(() -> new ReportException("Runbook not found with ID: " + request.getRunbookId()));

        // Populating fallbacks
        String title = request.getTitle() != null ? request.getTitle() : "Report: " + incident.getTitle();
        String problemStatement = request.getProblemStatement() != null ? request.getProblemStatement() : incident.getDescription();
        String aiAnalysis = request.getAiAnalysis() != null ? request.getAiAnalysis() : incident.getAiSummary();
        
        List<String> resolutionSteps = request.getResolutionSteps();
        if (resolutionSteps == null || resolutionSteps.isEmpty()) {
            if (incident.getSuggestedFix() != null) {
                resolutionSteps = List.of(incident.getSuggestedFix());
            } else {
                resolutionSteps = Collections.emptyList();
            }
        }

        IncidentReport report = IncidentReport.builder()
                .incidentId(incident.getId())
                .userId(user.getId())
                .runbookId(runbook.getId())
                .title(title)
                .problemStatement(problemStatement)
                .commandsExecuted(request.getCommandsExecuted())
                .commandOutputs(request.getCommandOutputs() != null ? request.getCommandOutputs() : Collections.emptyList())
                .aiAnalysis(aiAnalysis)
                .resolutionSteps(resolutionSteps)
                .executionTime(request.getExecutionTime() != null ? request.getExecutionTime() : "0s")
                .status(request.getStatus())
                .generatedAt(LocalDateTime.now())
                .build();

        IncidentReport saved = reportRepository.save(report);

        // Map URL back to saved report
        String reportUrl = "/api/reports/download/" + saved.getId();
        saved.setReportUrl(reportUrl);
        IncidentReport finalReport = reportRepository.save(saved);

        return mapToResponse(finalReport);
    }

    @Override
    public List<ReportSummaryResponse> getAllReports(String userEmail, String userRole) {
        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole) || "ADMIN".equalsIgnoreCase(userRole);
        List<IncidentReport> reports;

        if (isAdmin) {
            reports = reportRepository.findAll();
        } else {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ReportException("User not found with email: " + userEmail));
            reports = reportRepository.findByUserId(user.getId());
        }

        return reports.stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReportResponse getReportById(String id, String userEmail, String userRole) {
        IncidentReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ReportNotFoundException("Incident Report not found with ID: " + id));

        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole) || "ADMIN".equalsIgnoreCase(userRole);
        if (!isAdmin) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ReportException("User not found with email: " + userEmail));
            if (!report.getUserId().equals(user.getId())) {
                throw new PermissionException("You are not authorized to view this report");
            }
        }

        return mapToResponse(report);
    }

    @Override
    public void deleteReport(String id, String userEmail, String userRole) {
        IncidentReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ReportNotFoundException("Incident Report not found with ID: " + id));

        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole) || "ADMIN".equalsIgnoreCase(userRole);
        if (!isAdmin) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ReportException("User not found with email: " + userEmail));
            if (!report.getUserId().equals(user.getId())) {
                throw new PermissionException("You are not authorized to delete this report");
            }
        }

        reportRepository.delete(report);
    }

    @Override
    public byte[] downloadReport(String id, String userEmail, String userRole, ReportFormat format) {
        IncidentReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ReportNotFoundException("Incident Report not found with ID: " + id));

        boolean isAdmin = "ROLE_ADMIN".equalsIgnoreCase(userRole) || "ADMIN".equalsIgnoreCase(userRole);
        if (!isAdmin) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ReportException("User not found with email: " + userEmail));
            if (!report.getUserId().equals(user.getId())) {
                throw new PermissionException("You are not authorized to download this report");
            }
        }

        // Fetch auxiliary details for report generation
        String engineerName = userRepository.findById(report.getUserId())
                .map(User::getName)
                .orElse("Unknown Engineer");

        String runbookTitle = runbookRepository.findById(report.getRunbookId())
                .map(Runbook::getTitle)
                .orElse("Unknown Runbook");

        String incidentTitle = incidentRepository.findById(report.getIncidentId())
                .map(Incident::getTitle)
                .orElse("Unknown Incident");

        return exportService.exportReport(report, format, engineerName, runbookTitle, incidentTitle);
    }

    private ReportResponse mapToResponse(IncidentReport report) {
        return ReportResponse.builder()
                .id(report.getId())
                .incidentId(report.getIncidentId())
                .userId(report.getUserId())
                .runbookId(report.getRunbookId())
                .title(report.getTitle())
                .problemStatement(report.getProblemStatement())
                .commandsExecuted(report.getCommandsExecuted())
                .commandOutputs(report.getCommandOutputs())
                .aiAnalysis(report.getAiAnalysis())
                .resolutionSteps(report.getResolutionSteps())
                .executionTime(report.getExecutionTime())
                .status(report.getStatus())
                .generatedAt(report.getGeneratedAt())
                .reportUrl(report.getReportUrl())
                .build();
    }

    private ReportSummaryResponse mapToSummaryResponse(IncidentReport report) {
        return ReportSummaryResponse.builder()
                .id(report.getId())
                .incidentId(report.getIncidentId())
                .title(report.getTitle())
                .status(report.getStatus())
                .generatedAt(report.getGeneratedAt())
                .userId(report.getUserId())
                .reportUrl(report.getReportUrl())
                .build();
    }
}
