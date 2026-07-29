package com.resolvex.ai.controller;

import com.resolvex.ai.dto.GenerateReportRequest;
import com.resolvex.ai.dto.ReportResponse;
import com.resolvex.ai.dto.ReportSummaryResponse;
import com.resolvex.ai.model.ReportFormat;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<ReportResponse>> generateReport(
            @Valid @RequestBody GenerateReportRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        ReportResponse response = reportService.generateReport(request, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Incident report generated successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportSummaryResponse>>> getAllReports(
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        String userRole = getUserRole(userDetails);
        List<ReportSummaryResponse> reports = reportService.getAllReports(userEmail, userRole);
        return ResponseEntity.ok(ApiResponse.success("Incident reports retrieved successfully", reports));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        String userRole = getUserRole(userDetails);
        ReportResponse response = reportService.getReportById(id, userEmail, userRole);
        return ResponseEntity.ok(ApiResponse.success("Incident report retrieved successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        String userRole = getUserRole(userDetails);
        reportService.deleteReport(id, userEmail, userRole);
        return ResponseEntity.ok(ApiResponse.success("Incident report deleted successfully"));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadReport(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "PDF") ReportFormat format,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        String userRole = getUserRole(userDetails);
        
        byte[] fileBytes = reportService.downloadReport(id, userEmail, userRole, format);
        
        String filename = "incident_report_" + id + "." + format.name().toLowerCase();
        MediaType mediaType;
        switch (format) {
            case PDF:
                mediaType = MediaType.APPLICATION_PDF;
                break;
            case HTML:
                mediaType = MediaType.TEXT_HTML;
                break;
            case MARKDOWN:
                mediaType = MediaType.parseMediaType("text/markdown");
                break;
            case JSON:
                mediaType = MediaType.APPLICATION_JSON;
                break;
            default:
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(fileBytes);
    }

    private String getUserRole(UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_ENGINEER");
    }
}
