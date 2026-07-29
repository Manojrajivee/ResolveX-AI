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
public class ChartResponse {

    private ChartDataResponse barChart;
    
    private ChartDataResponse pieChart;
    
    private ChartDataResponse lineChart;
    
    private ChartDataResponse areaChart;
    
    private List<Map<String, Object>> monthlyStatistics;
    
    private List<Map<String, Object>> weeklyStatistics;
}
