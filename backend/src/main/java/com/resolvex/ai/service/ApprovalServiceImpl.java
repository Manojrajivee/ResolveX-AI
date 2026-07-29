package com.resolvex.ai.service;

import com.resolvex.ai.dto.ApprovalRequest;
import com.resolvex.ai.dto.ApprovalResponse;
import com.resolvex.ai.exception.WorkflowNotFoundException;
import com.resolvex.ai.model.Approval;
import com.resolvex.ai.model.ApprovalStatus;
import com.resolvex.ai.model.Workflow;
import com.resolvex.ai.model.WorkflowStatus;
import com.resolvex.ai.repository.ApprovalRepository;
import com.resolvex.ai.repository.WorkflowRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApprovalServiceImpl implements ApprovalService {

    private final ApprovalRepository approvalRepository;
    private final WorkflowRepository workflowRepository;
    private final ApplicationEventPublisher eventPublisher;

    public ApprovalServiceImpl(
            ApprovalRepository approvalRepository,
            WorkflowRepository workflowRepository,
            ApplicationEventPublisher eventPublisher) {
        this.approvalRepository = approvalRepository;
        this.workflowRepository = workflowRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public ApprovalResponse submitApprovalDecision(ApprovalRequest request, String approverId) {
        Workflow workflow = workflowRepository.findById(request.getWorkflowId())
                .orElseThrow(() -> new WorkflowNotFoundException("Workflow not found with id: " + request.getWorkflowId()));

        Approval approval = Approval.builder()
                .workflowId(request.getWorkflowId())
                .approverId(approverId)
                .status(request.getStatus())
                .comments(request.getComments())
                .approvedAt(LocalDateTime.now())
                .build();

        Approval saved = approvalRepository.save(approval);

        // Update workflow status based on approval decision
        if (request.getStatus() == ApprovalStatus.APPROVED) {
            workflow.setStatus(WorkflowStatus.COMPLETED);
        } else if (request.getStatus() == ApprovalStatus.REJECTED) {
            workflow.setStatus(WorkflowStatus.CANCELLED);
        }
        workflowRepository.save(workflow);

        // Publish event for notifications dispatch
        eventPublisher.publishEvent(saved);

        return mapToResponse(saved);
    }

    @Override
    public List<ApprovalResponse> getApprovalsForWorkflow(String workflowId) {
        return approvalRepository.findByWorkflowId(workflowId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApprovalResponse> getApprovalsByApprover(String approverId) {
        return approvalRepository.findByApproverId(approverId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ApprovalResponse mapToResponse(Approval approval) {
        return ApprovalResponse.builder()
                .id(approval.getId())
                .workflowId(approval.getWorkflowId())
                .approverId(approval.getApproverId())
                .status(approval.getStatus())
                .comments(approval.getComments())
                .approvedAt(approval.getApprovedAt())
                .build();
    }
}
