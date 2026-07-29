package com.resolvex.ai.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class PDFConfig {

    @Value("${app.reports.pdf.creator:ResolveX AI}")
    private String creator;

    @Value("${app.reports.pdf.title-prefix:AI Incident Report}")
    private String titlePrefix;

    @Value("${app.reports.pdf.page-size:A4}")
    private String pageSize;

    @Value("${app.reports.output-dir:./reports}")
    private String outputDirectory;
}
