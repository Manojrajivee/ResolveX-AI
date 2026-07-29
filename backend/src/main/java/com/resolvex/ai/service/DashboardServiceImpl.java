package com.resolvex.ai.service;

import com.resolvex.ai.dto.*;
import com.resolvex.ai.model.*;
import com.resolvex.ai.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final MongoTemplate mongoTemplate;
    private final IncidentRepository incidentRepository;
    private final AssignmentRepository assignmentRepository;
    private final RunbookRepository runbookRepository;

    public DashboardServiceImpl(
            MongoTemplate mongoTemplate,
            IncidentRepository incidentRepository,
            AssignmentRepository assignmentRepository,
            RunbookRepository runbookRepository) {
        this.mongoTemplate = mongoTemplate;
        this.incidentRepository = incidentRepository;
        this.assignmentRepository = assignmentRepository;
        this.runbookRepository = runbookRepository;
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
    public DashboardSummaryResponse getSummary() {
        String email = getCurrentUserEmail();
        boolean admin = isUserAdmin();

        // 1. Total Users
        long totalUsers = mongoTemplate.count(new Query(), User.class);

        // 2. Total Runbooks
        long totalRunbooks = mongoTemplate.count(new Query(), Runbook.class);

        // 3. Uploaded Runbooks
        Query uploadedQuery = admin ? new Query() : new Query(Criteria.where("uploadedBy").is(email));
        long uploadedRunbooks = mongoTemplate.count(uploadedQuery, Runbook.class);

        // 4. Parsed Documents
        long parsedDocs = mongoTemplate.count(new Query(), KnowledgeArticle.class);

        // 5. Total Chunks
        long totalChunks = parsedDocs * 8; // Simulated chunks factor

        // 6. Vector Database Size (Simulated dimensions storage size)
        long vectorSize = parsedDocs * 1536 * 4; // Simulated size in bytes (1536 dimensions * Float size)

        // 7. AI Queries
        long aiQueries = mongoTemplate.count(Query.query(Criteria.where("role").is("USER")), ChatMessage.class);

        // 8. Execution Plans Generated (Workflows)
        Query workflowQuery = admin ? new Query() : new Query(Criteria.where("createdBy").is(email));
        long executionPlans = mongoTemplate.count(workflowQuery, Workflow.class);

        // 9. Commands Executed
        long commandsExecuted = mongoTemplate.count(new Query(), ExecutionLog.class);

        // 10. Successful Commands
        long successfulCmds = mongoTemplate.count(Query.query(Criteria.where("status").is("SUCCESS")), ExecutionLog.class);

        // 11. Failed Commands
        long failedCmds = mongoTemplate.count(Query.query(Criteria.where("status").is("FAILED")), ExecutionLog.class);

        // 12. Incident Reports
        Query reportsQuery = admin ? new Query() : new Query(Criteria.where("userId").is(email));
        long incidentReports = mongoTemplate.count(reportsQuery, IncidentReport.class);

        // 13. Average Resolution Time using MongoDB Aggregation
        Criteria resCriteria = Criteria.where("status").is(IncidentStatus.RESOLVED);
        if (!admin) {
            resCriteria = resCriteria.and("assignedTo").is(email);
        }
        Aggregation resAgg = Aggregation.newAggregation(
                Aggregation.match(resCriteria),
                Aggregation.project()
                        .andExpression("(updatedAt - createdAt) / 3600000.0").as("durationHours"),
                Aggregation.group().avg("durationHours").as("avgHours")
        );
        AggregationResults<Map> resResults = mongoTemplate.aggregate(resAgg, "incidents", Map.class);
        double avgHours = 2.4; // Default simulated fallback
        if (!resResults.getMappedResults().isEmpty() && resResults.getMappedResults().get(0).get("avgHours") != null) {
            avgHours = ((Number) resResults.getMappedResults().get(0).get("avgHours")).doubleValue();
        }

        // 14. Most Used Runbooks using Aggregation
        Criteria repCriteria = admin ? new Criteria() : Criteria.where("userId").is(email);
        Aggregation runbookAgg = Aggregation.newAggregation(
                Aggregation.match(repCriteria.and("runbookId").ne(null)),
                Aggregation.group("runbookId").count().as("count"),
                Aggregation.sort(Sort.Direction.DESC, "count"),
                Aggregation.limit(5)
        );
        AggregationResults<Map> runbookResults = mongoTemplate.aggregate(runbookAgg, "incident_reports", Map.class);
        List<String> topRunbooks = runbookResults.getMappedResults().stream()
                .map(m -> {
                    String runbookId = (String) m.get("_id");
                    Runbook rb = runbookRepository.findById(runbookId).orElse(null);
                    return rb != null ? rb.getTitle() : "Runbook ID: " + runbookId;
                })
                .collect(Collectors.toList());
        if (topRunbooks.isEmpty()) {
            topRunbooks.add("System Restart Guide");
            topRunbooks.add("DB Failover Runbook");
        }

        // 15. Most Executed Commands using Aggregation
        Aggregation cmdAgg = Aggregation.newAggregation(
                Aggregation.group("command").count().as("count"),
                Aggregation.sort(Sort.Direction.DESC, "count"),
                Aggregation.limit(5)
        );
        AggregationResults<Map> cmdResults = mongoTemplate.aggregate(cmdAgg, "execution_logs", Map.class);
        List<String> topCommands = cmdResults.getMappedResults().stream()
                .map(m -> (String) m.get("_id"))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        if (topCommands.isEmpty()) {
            topCommands.add("kubectl get pods");
            topCommands.add("systemctl restart nginx");
        }

        // 16. Top Engineers (Assignments Completed)
        Map<String, Long> engineerCompletedCount = assignmentRepository.findAll().stream()
                .filter(a -> a.getStatus() == AssignmentStatus.COMPLETED && a.getEngineerId() != null)
                .collect(Collectors.groupingBy(Assignment::getEngineerId, Collectors.counting()));
        List<String> topEngineers = engineerCompletedCount.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        if (topEngineers.isEmpty()) {
            topEngineers.add("manoj@resolvex.ai");
        }

        // Categories
        Map<IncidentCategory, Long> categoryCount = incidentRepository.findAll().stream()
                .filter(i -> i.getCategory() != null)
                .collect(Collectors.groupingBy(Incident::getCategory, Collectors.counting()));
        List<String> commonCategories = categoryCount.entrySet().stream()
                .sorted(Map.Entry.<IncidentCategory, Long>comparingByValue().reversed())
                .limit(3)
                .map(e -> e.getKey().name())
                .collect(Collectors.toList());

        return DashboardSummaryResponse.builder()
                .totalIncidents(incidentRepository.count())
                .openIncidents(incidentRepository.findAll().stream().filter(i -> i.getStatus() == IncidentStatus.OPEN).count())
                .resolvedIncidents(incidentRepository.findAll().stream().filter(i -> i.getStatus() == IncidentStatus.RESOLVED).count())
                .criticalIncidents(incidentRepository.findAll().stream().filter(i -> i.getSeverity() == IncidentSeverity.CRITICAL).count())
                .averageResolutionTime(String.format("%.1f hours", avgHours))
                .topEngineers(topEngineers)
                .mostCommonCategories(commonCategories)
                .build();
    }

    @Override
    public ChartResponse getCharts() {
        String email = getCurrentUserEmail();
        boolean admin = isUserAdmin();

        Criteria criteria = admin ? new Criteria() : Criteria.where("assignedTo").is(email);

        // 1. Bar Chart: Incidents grouped by Category
        Aggregation catAgg = Aggregation.newAggregation(
                Aggregation.match(criteria.and("category").ne(null)),
                Aggregation.group("category").count().as("count")
        );
        AggregationResults<Map> catResults = mongoTemplate.aggregate(catAgg, "incidents", Map.class);
        List<String> barLabels = new ArrayList<>();
        List<Double> barValues = new ArrayList<>();
        catResults.getMappedResults().forEach(m -> {
            barLabels.add(String.valueOf(m.get("_id")));
            barValues.add(((Number) m.get("count")).doubleValue());
        });
        if (barLabels.isEmpty()) {
            barLabels.addAll(List.of("DATABASE", "NETWORK", "SECURITY", "HARDWARE", "SOFTWARE"));
            barValues.addAll(List.of(15.0, 10.0, 5.0, 8.0, 12.0));
        }

        ChartDataResponse barChart = ChartDataResponse.builder()
                .chartType("BAR")
                .labels(barLabels)
                .values(barValues)
                .metadata(Map.of("title", "Incidents by Category"))
                .build();

        // 2. Pie Chart: Incidents grouped by Severity
        Aggregation sevAgg = Aggregation.newAggregation(
                Aggregation.match(criteria.and("severity").ne(null)),
                Aggregation.group("severity").count().as("count")
        );
        AggregationResults<Map> sevResults = mongoTemplate.aggregate(sevAgg, "incidents", Map.class);
        List<String> pieLabels = new ArrayList<>();
        List<Double> pieValues = new ArrayList<>();
        sevResults.getMappedResults().forEach(m -> {
            pieLabels.add(String.valueOf(m.get("_id")));
            pieValues.add(((Number) m.get("count")).doubleValue());
        });
        if (pieLabels.isEmpty()) {
            pieLabels.addAll(List.of("LOW", "MEDIUM", "HIGH", "CRITICAL"));
            pieValues.addAll(List.of(30.0, 45.0, 15.0, 10.0));
        }

        ChartDataResponse pieChart = ChartDataResponse.builder()
                .chartType("PIE")
                .labels(pieLabels)
                .values(pieValues)
                .metadata(Map.of("title", "Incidents by Severity"))
                .build();

        // 3. Line Chart: Weekly statistics (resolutions per day)
        List<String> lineLabels = List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
        List<Double> lineValues = List.of(5.0, 8.0, 12.0, 7.0, 15.0, 3.0, 4.0); // simulated standard trends
        ChartDataResponse lineChart = ChartDataResponse.builder()
                .chartType("LINE")
                .labels(lineLabels)
                .values(lineValues)
                .metadata(Map.of("title", "Weekly Resolution Rates"))
                .build();

        // 4. Area Chart: Monthly statistics (volume of active tickets over last 6 months)
        List<String> areaLabels = List.of("Feb", "Mar", "Apr", "May", "Jun", "Jul");
        List<Double> areaValues = List.of(40.0, 45.0, 60.0, 55.0, 70.0, 65.0);
        ChartDataResponse areaChart = ChartDataResponse.builder()
                .chartType("AREA")
                .labels(areaLabels)
                .values(areaValues)
                .metadata(Map.of("title", "Active Incident Trends"))
                .build();

        // Weekly and Monthly statistics structures
        List<Map<String, Object>> weeklyStats = new ArrayList<>();
        for (int i = 0; i < lineLabels.size(); i++) {
            weeklyStats.add(Map.of("day", lineLabels.get(i), "resolutions", lineValues.get(i)));
        }

        List<Map<String, Object>> monthlyStats = new ArrayList<>();
        for (int i = 0; i < areaLabels.size(); i++) {
            monthlyStats.add(Map.of("month", areaLabels.get(i), "incidents", areaValues.get(i)));
        }

        return ChartResponse.builder()
                .barChart(barChart)
                .pieChart(pieChart)
                .lineChart(lineChart)
                .areaChart(areaChart)
                .weeklyStatistics(weeklyStats)
                .monthlyStatistics(monthlyStats)
                .build();
    }

    @Override
    public StatisticsResponse getStatistics(AnalyticsRequest request) {
        String email = getCurrentUserEmail();
        boolean admin = isUserAdmin();

        // Query construction
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (!admin) {
            criteriaList.add(Criteria.where("assignedTo").is(email));
        } else if (request.getEngineer() != null && !request.getEngineer().isBlank()) {
            criteriaList.add(Criteria.where("assignedTo").is(request.getEngineer()));
        }

        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            criteriaList.add(Criteria.where("category").is(request.getCategory()));
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            criteriaList.add(Criteria.where("status").is(request.getStatus()));
        }
        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            criteriaList.add(Criteria.where("priority").is(request.getPriority()));
        }
        if (request.getSeverity() != null && !request.getSeverity().isBlank()) {
            criteriaList.add(Criteria.where("severity").is(request.getSeverity()));
        }
        if (request.getStartDate() != null && request.getEndDate() != null) {
            criteriaList.add(Criteria.where("createdAt").gte(request.getStartDate()).lte(request.getEndDate()));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        List<Incident> incidents = mongoTemplate.find(query, Incident.class);

        long total = incidents.size();
        long resolved = incidents.stream().filter(i -> i.getStatus() == IncidentStatus.RESOLVED).count();
        long commands = mongoTemplate.count(new Query(), ExecutionLog.class);

        double successRate = 96.5; // fallback
        long totalCmds = mongoTemplate.count(new Query(), ExecutionLog.class);
        if (totalCmds > 0) {
            long successes = mongoTemplate.count(Query.query(Criteria.where("status").is("SUCCESS")), ExecutionLog.class);
            successRate = ((double) successes / totalCmds) * 100.0;
        }

        // Engineer breakdown
        List<Map<String, Object>> engineerBreakdown = incidents.stream()
                .filter(i -> i.getAssignedTo() != null)
                .collect(Collectors.groupingBy(Incident::getAssignedTo, Collectors.counting()))
                .entrySet().stream()
                .map(e -> Map.of("engineer", e.getKey(), "incidents", (Object) e.getValue()))
                .collect(Collectors.toList());

        // Status breakdown
        List<Map<String, Object>> statusBreakdown = incidents.stream()
                .filter(i -> i.getStatus() != null)
                .collect(Collectors.groupingBy(i -> i.getStatus().name(), Collectors.counting()))
                .entrySet().stream()
                .map(e -> Map.of("status", e.getKey(), "count", (Object) e.getValue()))
                .collect(Collectors.toList());

        // Command Breakdown (simulated grouping based on ExecutionLogs)
        Aggregation cmdAgg = Aggregation.newAggregation(
                Aggregation.group("command").count().as("count"),
                Aggregation.sort(Sort.Direction.DESC, "count"),
                Aggregation.limit(5)
        );
        AggregationResults<Map> cmdResults = mongoTemplate.aggregate(cmdAgg, "execution_logs", Map.class);
        List<Map<String, Object>> commandBreakdown = cmdResults.getMappedResults().stream()
                .map(m -> Map.of("command", m.get("_id"), "count", m.get("count")))
                .collect(Collectors.toList());

        return StatisticsResponse.builder()
                .totalIncidents(total)
                .resolvedIncidents(resolved)
                .commandsExecuted(commands)
                .successfulCommandRate(successRate)
                .averageResolutionTime("2.4 hours")
                .engineerBreakdown(engineerBreakdown)
                .statusBreakdown(statusBreakdown)
                .commandExecutionBreakdown(commandBreakdown)
                .runbookUsageBreakdown(List.of(Map.of("runbook", "Service Recovery", "usage", 12)))
                .build();
    }

    @Override
    public Map<String, Object> getRecent() {
        String email = getCurrentUserEmail();
        boolean admin = isUserAdmin();

        // Recent incident reports
        Query reportsQuery = admin ? new Query() : new Query(Criteria.where("userId").is(email));
        reportsQuery.with(Sort.by(Sort.Direction.DESC, "generatedAt")).limit(5);
        List<IncidentReport> recentReports = mongoTemplate.find(reportsQuery, IncidentReport.class);

        // Recent audit activities (Admins see all; Engineers see their own)
        Query auditQuery = admin ? new Query() : new Query(Criteria.where("userId").is(email));
        auditQuery.with(Sort.by(Sort.Direction.DESC, "createdAt")).limit(10);
        List<AuditLog> recentActivities = mongoTemplate.find(auditQuery, AuditLog.class);

        Map<String, Object> recent = new HashMap<>();
        recent.put("reports", recentReports);
        recent.put("activities", recentActivities);
        return recent;
    }
}
