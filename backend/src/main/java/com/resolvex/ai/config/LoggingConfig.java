package com.resolvex.ai.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class LoggingConfig {

    @Value("${app.logging.level:INFO}")
    private String level;
    
    @Value("${app.logging.max-days:30}")
    private int maxDays;
}
