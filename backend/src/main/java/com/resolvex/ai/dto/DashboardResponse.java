package com.resolvex.ai.dto;

import com.resolvex.ai.model.Dashboard.DashboardWidget;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private String id;
    
    private String name;
    
    private List<DashboardWidget> widgets;
}
