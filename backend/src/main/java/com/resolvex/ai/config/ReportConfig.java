package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ReportConfig {

    @Value("${app.reports.output-dir:./reports}")
    private String outputDirectory;

    public String getOutputDirectory() {
        return outputDirectory;
    }
}
