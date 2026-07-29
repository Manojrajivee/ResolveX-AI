package com.resolvex.ai.service;

import com.resolvex.ai.dto.*;
import com.resolvex.ai.model.IncidentCategory;
import com.resolvex.ai.model.IncidentPriority;
import com.resolvex.ai.model.IncidentSeverity;
import com.resolvex.ai.model.IncidentStatus;

public interface IncidentService {
    
    IncidentResponse createIncident(CreateIncidentRequest request, String createdBy);
    
    IncidentListResponse getAllIncidents(String title, IncidentCategory category, IncidentPriority priority,
                                         IncidentSeverity severity, IncidentStatus status,
                                         int pageNo, int pageSize, String sortBy, String sortDir);
    
    IncidentResponse getIncidentById(String id);
    
    IncidentResponse updateIncident(String id, UpdateIncidentRequest request, String currentUserEmail, boolean isAdmin);
    
    void deleteIncident(String id, String currentUserEmail, boolean isAdmin);
    
    IncidentAnalysisResponse analyzeIncident(String id);
}
