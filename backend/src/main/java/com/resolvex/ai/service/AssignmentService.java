package com.resolvex.ai.service;

import com.resolvex.ai.dto.AssignmentRequest;
import com.resolvex.ai.dto.AssignmentResponse;
import com.resolvex.ai.model.AssignmentStatus;

import java.util.List;

public interface AssignmentService {
    
    AssignmentResponse assignIncident(AssignmentRequest request);
    
    String recommendEngineer(String incidentId);
    
    List<AssignmentResponse> getAssignmentsByEngineer(String engineerId);
    
    AssignmentResponse acceptAssignment(String assignmentId, String engineerId);
    
    AssignmentResponse updateAssignmentStatus(String assignmentId, AssignmentStatus status, String engineerId);
}
