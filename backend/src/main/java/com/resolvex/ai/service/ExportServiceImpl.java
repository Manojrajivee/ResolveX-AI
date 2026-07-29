package com.resolvex.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resolvex.ai.model.IncidentReport;
import com.resolvex.ai.model.ReportFormat;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Service
public class ExportServiceImpl implements ExportService {

    private final PDFService pdfService;
    private final ObjectMapper objectMapper;

    public ExportServiceImpl(PDFService pdfService, ObjectMapper objectMapper) {
        this.pdfService = pdfService;
        this.objectMapper = objectMapper;
    }

    @Override
    public byte[] exportReport(IncidentReport report, ReportFormat format, String engineerName, String runbookTitle, String incidentTitle) {
        switch (format) {
            case PDF:
                return pdfService.generatePDF(report, engineerName, runbookTitle, incidentTitle);
            case MARKDOWN:
                return generateMarkdown(report, engineerName, runbookTitle, incidentTitle).getBytes(StandardCharsets.UTF_8);
            case HTML:
                return generateHTML(report, engineerName, runbookTitle, incidentTitle).getBytes(StandardCharsets.UTF_8);
            case JSON:
                return generateJSON(report);
            default:
                throw new IllegalArgumentException("Unsupported report format: " + format);
        }
    }

    private String generateMarkdown(IncidentReport report, String engineerName, String runbookTitle, String incidentTitle) {
        StringBuilder sb = new StringBuilder();
        sb.append("# AI Incident Report: ").append(report.getTitle() != null ? report.getTitle() : "Troubleshooting Session").append("\n\n");
        sb.append("## Incident Information\n");
        sb.append("- **Incident:** ").append(incidentTitle != null ? incidentTitle : "N/A").append(" (").append(report.getIncidentId()).append(")\n");
        sb.append("- **Runbook Used:** ").append(runbookTitle != null ? runbookTitle : "N/A").append(" (").append(report.getRunbookId()).append(")\n");
        sb.append("- **Engineer:** ").append(engineerName != null ? engineerName : "N/A").append(" (").append(report.getUserId()).append(")\n");
        sb.append("- **Status:** **").append(report.getStatus().name()).append("**\n");
        sb.append("- **Execution Time:** ").append(report.getExecutionTime() != null ? report.getExecutionTime() : "N/A").append("\n");
        sb.append("- **Generated At:** ").append(report.getGeneratedAt() != null ? report.getGeneratedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "N/A").append("\n\n");

        sb.append("## Issue Description\n");
        sb.append("> ").append(report.getProblemStatement() != null ? report.getProblemStatement().replace("\n", "\n> ") : "N/A").append("\n\n");

        sb.append("## Retrieved AI Context & Analysis\n");
        sb.append(report.getAiAnalysis() != null ? report.getAiAnalysis() : "No AI Analysis performed.").append("\n\n");

        sb.append("## Commands Executed\n");
        if (report.getCommandsExecuted() != null && !report.getCommandsExecuted().isEmpty()) {
            for (int i = 0; i < report.getCommandsExecuted().size(); i++) {
                String cmd = report.getCommandsExecuted().get(i);
                String out = (report.getCommandOutputs() != null && report.getCommandOutputs().size() > i) ? report.getCommandOutputs().get(i) : "No output recorded.";
                sb.append("### Command ").append(i + 1).append("\n");
                sb.append("```bash\n").append(cmd).append("\n```\n");
                sb.append("**Output:**\n");
                sb.append("```text\n").append(out).append("\n```\n\n");
            }
        } else {
            sb.append("*No commands executed.*\n\n");
        }

        sb.append("## Resolution Steps\n");
        if (report.getResolutionSteps() != null && !report.getResolutionSteps().isEmpty()) {
            for (int i = 0; i < report.getResolutionSteps().size(); i++) {
                sb.append((i + 1)).append(". ").append(report.getResolutionSteps().get(i)).append("\n");
            }
        } else {
            sb.append("*No resolution steps recorded.*\n");
        }

        return sb.toString();
    }

    private String generateHTML(IncidentReport report, String engineerName, String runbookTitle, String incidentTitle) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html>\n");
        sb.append("<html lang=\"en\">\n");
        sb.append("<head>\n");
        sb.append("    <meta charset=\"UTF-8\">\n");
        sb.append("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n");
        sb.append("    <title>AI Incident Report - ").append(report.getTitle()).append("</title>\n");
        sb.append("    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\">\n");
        sb.append("    <style>\n");
        sb.append("        :root {\n");
        sb.append("            --primary: #2980b9;\n");
        sb.append("            --primary-dark: #2c3e50;\n");
        sb.append("            --success: #27ae60;\n");
        sb.append("            --danger: #c0392b;\n");
        sb.append("            --background: #f8f9fa;\n");
        sb.append("            --surface: #ffffff;\n");
        sb.append("            --text: #2c3e50;\n");
        sb.append("            --text-muted: #7f8c8d;\n");
        sb.append("            --border: #e2e8f0;\n");
        sb.append("            --code-bg: #1e1e24;\n");
        sb.append("            --code-text: #f8f8f2;\n");
        sb.append("        }\n");
        sb.append("        body {\n");
        sb.append("            font-family: 'Inter', sans-serif;\n");
        sb.append("            background-color: var(--background);\n");
        sb.append("            color: var(--text);\n");
        sb.append("            line-height: 1.6;\n");
        sb.append("            margin: 0;\n");
        sb.append("            padding: 40px 20px;\n");
        sb.append("        }\n");
        sb.append("        .container {\n");
        sb.append("            max-width: 850px;\n");
        sb.append("            margin: 0 auto;\n");
        sb.append("            background: var(--surface);\n");
        sb.append("            border-radius: 12px;\n");
        sb.append("            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);\n");
        sb.append("            border: 1px solid var(--border);\n");
        sb.append("            overflow: hidden;\n");
        sb.append("        }\n");
        sb.append("        .header {\n");
        sb.append("            background-color: var(--primary-dark);\n");
        sb.append("            color: white;\n");
        sb.append("            padding: 40px;\n");
        sb.append("            position: relative;\n");
        sb.append("        }\n");
        sb.append("        .header h1 {\n");
        sb.append("            margin: 0 0 10px 0;\n");
        sb.append("            font-size: 28px;\n");
        sb.append("            font-weight: 700;\n");
        sb.append("            letter-spacing: -0.5px;\n");
        sb.append("        }\n");
        sb.append("        .header .subtitle {\n");
        sb.append("            font-size: 16px;\n");
        sb.append("            opacity: 0.9;\n");
        sb.append("            margin: 0;\n");
        sb.append("        }\n");
        sb.append("        .badge {\n");
        sb.append("            display: inline-block;\n");
        sb.append("            padding: 6px 12px;\n");
        sb.append("            border-radius: 20px;\n");
        sb.append("            font-size: 12px;\n");
        sb.append("            font-weight: 600;\n");
        sb.append("            text-transform: uppercase;\n");
        sb.append("        }\n");
        sb.append("        .badge-success {\n");
        sb.append("            background-color: rgba(39, 174, 96, 0.1);\n");
        sb.append("            color: var(--success);\n");
        sb.append("            border: 1px solid var(--success);\n");
        sb.append("        }\n");
        sb.append("        .badge-danger {\n");
        sb.append("            background-color: rgba(192, 57, 43, 0.1);\n");
        sb.append("            color: var(--danger);\n");
        sb.append("            border: 1px solid var(--danger);\n");
        sb.append("        }\n");
        sb.append("        .content {\n");
        sb.append("            padding: 40px;\n");
        sb.append("        }\n");
        sb.append("        .section {\n");
        sb.append("            margin-bottom: 35px;\n");
        sb.append("        }\n");
        sb.append("        .section h2 {\n");
        sb.append("            font-size: 18px;\n");
        sb.append("            font-weight: 600;\n");
        sb.append("            color: var(--primary);\n");
        sb.append("            border-bottom: 2px solid var(--border);\n");
        sb.append("            padding-bottom: 8px;\n");
        sb.append("            margin-top: 0;\n");
        sb.append("            margin-bottom: 15px;\n");
        sb.append("        }\n");
        sb.append("        .meta-grid {\n");
        sb.append("            display: grid;\n");
        sb.append("            grid-template-columns: repeat(2, 1fr);\n");
        sb.append("            gap: 20px;\n");
        sb.append("        }\n");
        sb.append("        .meta-item {\n");
        sb.append("            background: #fdfdfd;\n");
        sb.append("            border: 1px solid var(--border);\n");
        sb.append("            padding: 15px;\n");
        sb.append("            border-radius: 8px;\n");
        sb.append("        }\n");
        sb.append("        .meta-item .label {\n");
        sb.append("            font-size: 11px;\n");
        sb.append("            text-transform: uppercase;\n");
        sb.append("            color: var(--text-muted);\n");
        sb.append("            margin-bottom: 5px;\n");
        sb.append("            font-weight: 600;\n");
        sb.append("        }\n");
        sb.append("        .meta-item .value {\n");
        sb.append("            font-size: 14px;\n");
        sb.append("            font-weight: 500;\n");
        sb.append("        }\n");
        sb.append("        .blockquote {\n");
        sb.append("            border-left: 4px solid var(--primary);\n");
        sb.append("            background-color: #f7fafc;\n");
        sb.append("            padding: 15px 20px;\n");
        sb.append("            margin: 0;\n");
        sb.append("            border-radius: 0 8px 8px 0;\n");
        sb.append("            font-style: italic;\n");
        sb.append("        }\n");
        sb.append("        .command-block {\n");
        sb.append("            margin-bottom: 20px;\n");
        sb.append("            border: 1px solid var(--border);\n");
        sb.append("            border-radius: 8px;\n");
        sb.append("            overflow: hidden;\n");
        sb.append("        }\n");
        sb.append("        .command-title {\n");
        sb.append("            background-color: #edf2f7;\n");
        sb.append("            padding: 10px 15px;\n");
        sb.append("            font-family: monospace;\n");
        sb.append("            font-weight: 600;\n");
        sb.append("            font-size: 13px;\n");
        sb.append("            border-bottom: 1px solid var(--border);\n");
        sb.append("        }\n");
        sb.append("        .command-output {\n");
        sb.append("            background-color: var(--code-bg);\n");
        sb.append("            color: var(--code-text);\n");
        sb.append("            padding: 15px;\n");
        sb.append("            margin: 0;\n");
        sb.append("            font-family: 'Courier New', Courier, monospace;\n");
        sb.append("            font-size: 12px;\n");
        sb.append("            white-space: pre-wrap;\n");
        sb.append("            overflow-x: auto;\n");
        sb.append("        }\n");
        sb.append("        ol {\n");
        sb.append("            padding-left: 20px;\n");
        sb.append("            margin: 0;\n");
        sb.append("        }\n");
        sb.append("        li {\n");
        sb.append("            margin-bottom: 8px;\n");
        sb.append("        }\n");
        sb.append("        .footer {\n");
        sb.append("            text-align: center;\n");
        sb.append("            margin-top: 40px;\n");
        sb.append("            font-size: 12px;\n");
        sb.append("            color: var(--text-muted);\n");
        sb.append("        }\n");
        sb.append("    </style>\n");
        sb.append("</head>\n");
        sb.append("<body>\n");
        sb.append("    <div class=\"container\">\n");
        sb.append("        <div class=\"header\">\n");
        sb.append("            <h1>").append(report.getTitle() != null ? report.getTitle() : "Incident Report").append("</h1>\n");
        sb.append("            <p class=\"subtitle\">AI-Generated Troubleshooting Session Report</p>\n");
        sb.append("        </div>\n");
        sb.append("        <div class=\"content\">\n");
        
        // Metadata grid
        sb.append("            <div class=\"section\">\n");
        sb.append("                <h2>Report Overview</h2>\n");
        sb.append("                <div class=\"meta-grid\">\n");
        sb.append("                    <div class=\"meta-item\"><div class=\"label\">Report ID</div><div class=\"value\">").append(report.getId() != null ? report.getId() : "N/A").append("</div></div>\n");
        sb.append("                    <div class=\"meta-item\"><div class=\"label\">Incident</div><div class=\"value\">").append(incidentTitle != null ? incidentTitle : "N/A").append(" (").append(report.getIncidentId()).append(")</div></div>\n");
        sb.append("                    <div class=\"meta-item\"><div class=\"label\">Runbook Used</div><div class=\"value\">").append(runbookTitle != null ? runbookTitle : "N/A").append("</div></div>\n");
        sb.append("                    <div class=\"meta-item\"><div class=\"label\">Engineer</div><div class=\"value\">").append(engineerName != null ? engineerName : "N/A").append("</div></div>\n");
        sb.append("                    <div class=\"meta-item\"><div class=\"label\">Generated At</div><div class=\"value\">").append(report.getGeneratedAt() != null ? report.getGeneratedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : "N/A").append("</div></div>\n");
        sb.append("                    <div class=\"meta-item\"><div class=\"label\">Execution Time</div><div class=\"value\">").append(report.getExecutionTime() != null ? report.getExecutionTime() : "N/A").append("</div></div>\n");
        sb.append("                    <div class=\"meta-item\"><div class=\"label\">Status</div><div class=\"value\"><span class=\"badge ").append(report.getStatus() == com.resolvex.ai.model.ReportStatus.SUCCESS ? "badge-success" : "badge-danger").append("\">").append(report.getStatus().name()).append("</span></div></div>\n");
        sb.append("                </div>\n");
        sb.append("            </div>\n");

        // Issue Description
        sb.append("            <div class=\"section\">\n");
        sb.append("                <h2>Issue Description</h2>\n");
        sb.append("                <div class=\"blockquote\">").append(report.getProblemStatement() != null ? report.getProblemStatement().replace("\n", "<br>") : "N/A").append("</div>\n");
        sb.append("            </div>\n");

        // AI Context
        sb.append("            <div class=\"section\">\n");
        sb.append("                <h2>Retrieved AI Context & Analysis</h2>\n");
        sb.append("                <p>").append(report.getAiAnalysis() != null ? report.getAiAnalysis().replace("\n", "<br>") : "No AI analysis performed.").append("</p>\n");
        sb.append("            </div>\n");

        // Commands
        sb.append("            <div class=\"section\">\n");
        sb.append("                <h2>Commands Executed</h2>\n");
        if (report.getCommandsExecuted() != null && !report.getCommandsExecuted().isEmpty()) {
            for (int i = 0; i < report.getCommandsExecuted().size(); i++) {
                String cmd = report.getCommandsExecuted().get(i);
                String out = (report.getCommandOutputs() != null && report.getCommandOutputs().size() > i) ? report.getCommandOutputs().get(i) : "No output recorded.";
                sb.append("                <div class=\"command-block\">\n");
                sb.append("                    <div class=\"command-title\">$ ").append(cmd).append("</div>\n");
                sb.append("                    <pre class=\"command-output\">").append(out).append("</pre>\n");
                sb.append("                </div>\n");
            }
        } else {
            sb.append("                <p>No commands executed.</p>\n");
        }
        sb.append("            </div>\n");

        // Resolution steps
        sb.append("            <div class=\"section\">\n");
        sb.append("                <h2>Resolution Steps</h2>\n");
        if (report.getResolutionSteps() != null && !report.getResolutionSteps().isEmpty()) {
            sb.append("                <ol>\n");
            for (String step : report.getResolutionSteps()) {
                sb.append("                    <li>").append(step).append("</li>\n");
            }
            sb.append("                </ol>\n");
        } else {
            sb.append("                <p>No resolution steps recorded.</p>\n");
        }
        sb.append("            </div>\n");

        sb.append("        </div>\n");
        sb.append("        <div class=\"footer\">\n");
        sb.append("            <p>&copy; ").append(java.time.Year.now().getValue()).append(" ResolveX AI. All rights reserved.</p>\n");
        sb.append("        </div>\n");
        sb.append("    </div>\n");
        sb.append("</body>\n");
        sb.append("</html>\n");

        return sb.toString();
    }

    private byte[] generateJSON(IncidentReport report) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(report);
        } catch (Exception e) {
            throw new RuntimeException("Error mapping report to JSON bytes: " + e.getMessage(), e);
        }
    }
}
