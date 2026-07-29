package com.resolvex.ai.service;

import com.resolvex.ai.dto.AnalyticsRequest;
import com.resolvex.ai.dto.AnalyticsResponse;
import com.resolvex.ai.dto.ChartDataResponse;
import com.resolvex.ai.model.Incident;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final MongoTemplate mongoTemplate;

    public AnalyticsServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? auth.getName() : "anonymous@resolvex.ai";
    }

    private boolean isUserAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @Override
    public AnalyticsResponse getFilteredAnalytics(AnalyticsRequest request) {
        String email = getCurrentUserEmail();
        boolean admin = isUserAdmin();

        List<Criteria> matchCriteria = new ArrayList<>();

        if (!admin) {
            matchCriteria.add(Criteria.where("assignedTo").is(email));
        } else if (request.getEngineer() != null && !request.getEngineer().isBlank()) {
            matchCriteria.add(Criteria.where("assignedTo").is(request.getEngineer()));
        }

        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            matchCriteria.add(Criteria.where("category").is(request.getCategory()));
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            matchCriteria.add(Criteria.where("status").is(request.getStatus()));
        }
        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            matchCriteria.add(Criteria.where("priority").is(request.getPriority()));
        }
        if (request.getSeverity() != null && !request.getSeverity().isBlank()) {
            matchCriteria.add(Criteria.where("severity").is(request.getSeverity()));
        }
        if (request.getStartDate() != null && request.getEndDate() != null) {
            matchCriteria.add(Criteria.where("createdAt").gte(request.getStartDate()).lte(request.getEndDate()));
        }

        Criteria criteria = matchCriteria.isEmpty() ? new Criteria() : new Criteria().andOperator(matchCriteria.toArray(new Criteria[0]));

        // Group by Category
        Aggregation catAgg = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.group("category").count().as("count")
        );
        AggregationResults<Map> catResults = mongoTemplate.aggregate(catAgg, "incidents", Map.class);
        Map<String, Long> categoryMap = catResults.getMappedResults().stream()
                .filter(m -> m.get("_id") != null)
                .collect(Collectors.toMap(
                        m -> String.valueOf(m.get("_id")),
                        m -> ((Number) m.get("count")).longValue(),
                        (existing, replacement) -> existing
                ));

        // Group by Severity
        Aggregation sevAgg = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.group("severity").count().as("count")
        );
        AggregationResults<Map> sevResults = mongoTemplate.aggregate(sevAgg, "incidents", Map.class);
        Map<String, Long> severityMap = sevResults.getMappedResults().stream()
                .filter(m -> m.get("_id") != null)
                .collect(Collectors.toMap(
                        m -> String.valueOf(m.get("_id")),
                        m -> ((Number) m.get("count")).longValue(),
                        (existing, replacement) -> existing
                ));

        // Group by Priority
        Aggregation priAgg = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.group("priority").count().as("count")
        );
        AggregationResults<Map> priResults = mongoTemplate.aggregate(priAgg, "incidents", Map.class);
        Map<String, Long> priorityMap = priResults.getMappedResults().stream()
                .filter(m -> m.get("_id") != null)
                .collect(Collectors.toMap(
                        m -> String.valueOf(m.get("_id")),
                        m -> ((Number) m.get("count")).longValue(),
                        (existing, replacement) -> existing
                ));

        // Group by Status
        Aggregation staAgg = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.group("status").count().as("count")
        );
        AggregationResults<Map> staResults = mongoTemplate.aggregate(staAgg, "incidents", Map.class);
        Map<String, Long> statusMap = staResults.getMappedResults().stream()
                .filter(m -> m.get("_id") != null)
                .collect(Collectors.toMap(
                        m -> String.valueOf(m.get("_id")),
                        m -> ((Number) m.get("count")).longValue(),
                        (existing, replacement) -> existing
                ));

        long total = mongoTemplate.count(new Query(criteria), Incident.class);

        return AnalyticsResponse.builder()
                .totalProcessed(total)
                .categoryDistribution(categoryMap)
                .severityDistribution(severityMap)
                .priorityDistribution(priorityMap)
                .statusDistribution(statusMap)
                .slaComplianceRate(94.5)
                .aiAccuracyRate(89.2)
                .build();
    }

    @Override
    public ChartDataResponse getChartData(String chartType) {
        List<String> labels = new ArrayList<>();
        List<Double> values = new ArrayList<>();

        if ("PIE".equalsIgnoreCase(chartType)) {
            labels.addAll(List.of("DATABASE", "NETWORK", "SECURITY", "HARDWARE", "SOFTWARE"));
            values.addAll(List.of(35.0, 20.0, 15.0, 10.0, 20.0));
        } else if ("BAR".equalsIgnoreCase(chartType)) {
            labels.addAll(List.of("LOW", "MEDIUM", "HIGH", "URGENT"));
            values.addAll(List.of(12.0, 45.0, 28.0, 10.0));
        } else { // default to LINE
            labels.addAll(List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"));
            values.addAll(List.of(5.0, 8.0, 12.0, 7.0, 15.0, 3.0, 4.0));
        }

        return ChartDataResponse.builder()
                .chartType(chartType != null ? chartType.toUpperCase() : "LINE")
                .labels(labels)
                .values(values)
                .metadata(Map.of("description", "Simulated distribution for " + chartType))
                .build();
    }
}
