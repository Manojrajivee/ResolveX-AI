package com.resolvex.ai.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.List;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.resolvex.ai.config.PDFConfig;
import com.resolvex.ai.model.IncidentReport;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PDFServiceImpl implements PDFService {

    private final PDFConfig pdfConfig;

    public PDFServiceImpl(PDFConfig pdfConfig) {
        this.pdfConfig = pdfConfig;
    }

    @Override
    public byte[] generatePDF(IncidentReport report, String engineerName, String runbookTitle, String incidentTitle) {
        Document document = new Document(PageSize.A4, 36, 36, 54, 54);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Meta Info
            document.addTitle("ResolveX AI - Incident Report");
            document.addCreator(pdfConfig.getCreator());

            // Font Settings
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.DARK_GRAY);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(41, 128, 185));
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font codeFont = FontFactory.getFont(FontFactory.COURIER, 9, new Color(44, 62, 80));

            // Header Section
            Paragraph title = new Paragraph("RESOLVEX AI INCIDENT REPORT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Metadata Table
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setSpacingAfter(15);
            
            addMetaRow(metaTable, "Report ID:", report.getId() != null ? report.getId() : "N/A", boldFont, normalFont);
            addMetaRow(metaTable, "Incident Title / ID:", (incidentTitle != null ? incidentTitle : "N/A") + " (" + report.getIncidentId() + ")", boldFont, normalFont);
            addMetaRow(metaTable, "Engineer Details:", engineerName != null ? engineerName : "N/A", boldFont, normalFont);
            addMetaRow(metaTable, "Runbook Used:", runbookTitle != null ? runbookTitle : "N/A", boldFont, normalFont);
            addMetaRow(metaTable, "Status:", report.getStatus().name(), boldFont, report.getStatus().name().equals("SUCCESS") ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(39, 174, 96)) : FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(192, 57, 43)));
            addMetaRow(metaTable, "Generated At:", report.getGeneratedAt() != null ? report.getGeneratedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : "N/A", boldFont, normalFont);
            addMetaRow(metaTable, "Execution Time:", report.getExecutionTime() != null ? report.getExecutionTime() : "N/A", boldFont, normalFont);

            document.add(metaTable);

            // Issue Description Section
            document.add(new Paragraph("Issue Description", sectionFont));
            Paragraph issueDesc = new Paragraph(report.getProblemStatement() != null ? report.getProblemStatement() : "No problem statement provided.", normalFont);
            issueDesc.setSpacingAfter(15);
            document.add(issueDesc);

            // Execution Plan & AI Context
            document.add(new Paragraph("Retrieved AI Context & Execution Plan", sectionFont));
            Paragraph contextPlan = new Paragraph(report.getAiAnalysis() != null ? report.getAiAnalysis() : "No AI analysis performed.", normalFont);
            contextPlan.setSpacingAfter(15);
            document.add(contextPlan);

            // Commands and Outputs Section
            document.add(new Paragraph("Commands Executed & Outputs", sectionFont));
            if (report.getCommandsExecuted() != null && !report.getCommandsExecuted().isEmpty()) {
                for (int i = 0; i < report.getCommandsExecuted().size(); i++) {
                    String cmd = report.getCommandsExecuted().get(i);
                    String output = (report.getCommandOutputs() != null && report.getCommandOutputs().size() > i) ? report.getCommandOutputs().get(i) : "No output recorded.";
                    
                    Paragraph cmdPara = new Paragraph("Command [" + (i + 1) + "]: " + cmd, boldFont);
                    cmdPara.setSpacingBefore(5);
                    document.add(cmdPara);

                    PdfPTable codeTable = new PdfPTable(1);
                    codeTable.setWidthPercentage(100);
                    codeTable.setSpacingBefore(5);
                    codeTable.setSpacingAfter(10);
                    
                    PdfPCell cell = new PdfPCell(new Phrase(output, codeFont));
                    cell.setBackgroundColor(new Color(245, 247, 250));
                    cell.setPadding(8);
                    cell.setBorderColor(new Color(220, 224, 230));
                    codeTable.addCell(cell);
                    
                    document.add(codeTable);
                }
            } else {
                Paragraph noCmds = new Paragraph("No commands executed during this session.", normalFont);
                noCmds.setSpacingAfter(15);
                document.add(noCmds);
            }

            // Resolution Steps Section
            document.add(new Paragraph("Resolution Steps", sectionFont));
            if (report.getResolutionSteps() != null && !report.getResolutionSteps().isEmpty()) {
                List list = new List(List.ORDERED);
                list.setPreSymbol("- ");
                for (String step : report.getResolutionSteps()) {
                    list.add(new ListItem(step, normalFont));
                }
                document.add(list);
            } else {
                Paragraph noSteps = new Paragraph("No specific resolution steps recorded.", normalFont);
                noSteps.setSpacingAfter(15);
                document.add(noSteps);
            }

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF document: " + e.getMessage(), e);
        }

        return out.toByteArray();
    }

    private void addMetaRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }
}
