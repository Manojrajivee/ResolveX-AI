package com.resolvex.ai.service;

import com.resolvex.ai.dto.CreateWorkflowRequest;
import com.resolvex.ai.dto.WorkflowResponse;
import com.resolvex.ai.model.WorkflowStatus;

import java.util.List;

public interface WorkflowService {
    
    WorkflowResponse createWorkflow(CreateWorkflowRequest request, String createdBy);
    
    List<WorkflowResponse> getAllWorkflows();
    
    WorkflowResponse getWorkflowById(String id);
    
    WorkflowResponse updateWorkflowStatus(String id, WorkflowStatus status);
    
    void deleteWorkflow(String id);
}
