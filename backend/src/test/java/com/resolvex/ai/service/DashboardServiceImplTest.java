package com.resolvex.ai.service;

import com.resolvex.ai.dto.AnalyticsRequest;
import com.resolvex.ai.dto.ChartResponse;
import com.resolvex.ai.dto.DashboardSummaryResponse;
import com.resolvex.ai.dto.StatisticsResponse;
import com.resolvex.ai.model.*;
import com.resolvex.ai.repository.AssignmentRepository;
import com.resolvex.ai.repository.IncidentRepository;
import com.resolvex.ai.repository.RunbookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

public class DashboardServiceImplTest {

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private RunbookRepository runbookRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private DashboardServiceImpl dashboardService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        dashboardService = new DashboardServiceImpl(mongoTemplate, incidentRepository, assignmentRepository, runbookRepository);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    @Test
    public void testGetSummaryAsAdmin() {
        // Setup current user
        when(authentication.getName()).thenReturn("admin@resolvex.ai");
        Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        when(authentication.getAuthorities()).thenReturn((Collection) authorities);

        // Mock repository counts
        when(incidentRepository.count()).thenReturn(10L);
        when(incidentRepository.findAll()).thenReturn(List.of(
                Incident.builder().status(IncidentStatus.OPEN).severity(IncidentSeverity.CRITICAL).build(),
                Incident.builder().status(IncidentStatus.RESOLVED).severity(IncidentSeverity.LOW).build()
        ));

        // Mock MongoDB counts
        when(mongoTemplate.count(any(), eq(User.class))).thenReturn(5L);
        when(mongoTemplate.count(any(), eq(Runbook.class))).thenReturn(3L);
        when(mongoTemplate.count(any(), eq(KnowledgeArticle.class))).thenReturn(8L);
        when(mongoTemplate.count(any(), eq(ChatMessage.class))).thenReturn(20L);
        when(mongoTemplate.count(any(), eq(Workflow.class))).thenReturn(4L);
        when(mongoTemplate.count(any(), eq(ExecutionLog.class))).thenReturn(15L);
        when(mongoTemplate.count(any(), eq(IncidentReport.class))).thenReturn(6L);

        // Mock resolution time aggregation
        AggregationResults<Map> resResults = new AggregationResults<>(List.of(Map.of("avgHours", 1.8)), new org.bson.Document());
        when(mongoTemplate.aggregate(any(Aggregation.class), eq("incidents"), eq(Map.class))).thenReturn(resResults);

        // Mock most used runbooks aggregation
        AggregationResults<Map> runbookResults = new AggregationResults<>(List.of(Map.of("_id", "rb-123", "count", 5)), new org.bson.Document());
        when(mongoTemplate.aggregate(any(Aggregation.class), eq("incident_reports"), eq(Map.class))).thenReturn(runbookResults);
        when(runbookRepository.findById("rb-123")).thenReturn(Optional.of(Runbook.builder().title("Restart Server").build()));

        // Mock most executed commands aggregation
        AggregationResults<Map> cmdResults = new AggregationResults<>(List.of(Map.of("_id", "docker ps", "count", 10)), new org.bson.Document());
        when(mongoTemplate.aggregate(any(Aggregation.class), eq("execution_logs"), eq(Map.class))).thenReturn(cmdResults);

        // Mock assignment repository list for top engineers
        when(assignmentRepository.findAll()).thenReturn(List.of(
                Assignment.builder().engineerId("eng1@resolvex.ai").status(AssignmentStatus.COMPLETED).build()
        ));

        // Call method
        DashboardSummaryResponse summary = dashboardService.getSummary();

        // Verify
        assertNotNull(summary);
        assertEquals(10L, summary.getTotalIncidents());
        assertEquals(1L, summary.getOpenIncidents());
        assertEquals(1L, summary.getResolvedIncidents());
        assertEquals(1L, summary.getCriticalIncidents());
        assertEquals("1.8 hours", summary.getAverageResolutionTime());
        assertTrue(summary.getTopEngineers().contains("eng1@resolvex.ai"));
    }

    @Test
    public void testGetCharts() {
        // Setup current user
        when(authentication.getName()).thenReturn("eng1@resolvex.ai");
        Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_ENGINEER"));
        when(authentication.getAuthorities()).thenReturn((Collection) authorities);

        // Mock aggregations
        AggregationResults<Map> catResults = new AggregationResults<>(List.of(Map.of("_id", "DATABASE", "count", 4)), new org.bson.Document());
        when(mongoTemplate.aggregate(any(Aggregation.class), eq("incidents"), eq(Map.class))).thenReturn(catResults);

        // Call method
        ChartResponse charts = dashboardService.getCharts();

        // Verify
        assertNotNull(charts);
        assertNotNull(charts.getBarChart());
        assertNotNull(charts.getPieChart());
        assertEquals("BAR", charts.getBarChart().getChartType());
        assertTrue(charts.getBarChart().getLabels().contains("DATABASE"));
    }
}
