package com.resolvex.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "dashboards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dashboard {

    @Id
    private String id;

    private String name;

    private List<DashboardWidget> widgets;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardWidget {
        private String widgetId;
        private String title;
        private String type; // e.g. BAR_CHART, PIE_CHART, KPI_CARD
        private int size;    // Grid layout size parameter
    }
}
