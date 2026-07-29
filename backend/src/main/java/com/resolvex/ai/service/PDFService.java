package com.resolvex.ai.service;

import com.resolvex.ai.model.IncidentReport;

public interface PDFService {
    byte[] generatePDF(IncidentReport report, String engineerName, String runbookTitle, String incidentTitle);
}
