package com.resolvex.ai.service;

import com.resolvex.ai.dto.ApprovalRequest;
import com.resolvex.ai.dto.ApprovalResponse;

import java.util.List;

public interface ApprovalService {
    
    ApprovalResponse submitApprovalDecision(ApprovalRequest request, String approverId);
    
    List<ApprovalResponse> getApprovalsForWorkflow(String workflowId);
    
    List<ApprovalResponse> getApprovalsByApprover(String approverId);
}
