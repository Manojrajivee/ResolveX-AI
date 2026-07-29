package com.resolvex.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChartDataResponse {

    private String chartType; // LINE, BAR, PIE, AREA, HEATMAP
    
    private List<String> labels;
    
    private List<Double> values;
    
    private Map<String, Object> metadata;
}
