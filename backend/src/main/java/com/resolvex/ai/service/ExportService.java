package com.resolvex.ai.service;

import com.resolvex.ai.model.IncidentReport;
import com.resolvex.ai.model.ReportFormat;

public interface ExportService {
    byte[] exportReport(IncidentReport report, ReportFormat format, String engineerName, String runbookTitle, String incidentTitle);
}
