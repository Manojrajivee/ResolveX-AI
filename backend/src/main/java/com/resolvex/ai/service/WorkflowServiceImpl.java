package com.resolvex.ai.service;

import com.resolvex.ai.dto.CreateWorkflowRequest;
import com.resolvex.ai.dto.WorkflowResponse;
import com.resolvex.ai.exception.IncidentNotFoundException;
import com.resolvex.ai.exception.WorkflowNotFoundException;
import com.resolvex.ai.model.Workflow;
import com.resolvex.ai.model.WorkflowStatus;
import com.resolvex.ai.repository.IncidentRepository;
import com.resolvex.ai.repository.WorkflowRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkflowServiceImpl implements WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final IncidentRepository incidentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public WorkflowServiceImpl(
            WorkflowRepository workflowRepository,
            IncidentRepository incidentRepository,
            ApplicationEventPublisher eventPublisher) {
        this.workflowRepository = workflowRepository;
        this.incidentRepository = incidentRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public WorkflowResponse createWorkflow(CreateWorkflowRequest request, String createdBy) {
        // Verify incident exists
        incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + request.getIncidentId()));

        Workflow workflow = Workflow.builder()
                .incidentId(request.getIncidentId())
                .workflowName(request.getWorkflowName())
                .status(WorkflowStatus.ACTIVE)
                .createdBy(createdBy)
                .build();

        Workflow saved = workflowRepository.save(workflow);

        // Publish event for workflow creation alerts
        eventPublisher.publishEvent(saved);

        return mapToResponse(saved);
    }

    @Override
    public List<WorkflowResponse> getAllWorkflows() {
        return workflowRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WorkflowResponse getWorkflowById(String id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new WorkflowNotFoundException("Workflow not found with id: " + id));
        return mapToResponse(workflow);
    }

    @Override
    public WorkflowResponse updateWorkflowStatus(String id, WorkflowStatus status) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new WorkflowNotFoundException("Workflow not found with id: " + id));

        workflow.setStatus(status);
        Workflow updated = workflowRepository.save(workflow);
        return mapToResponse(updated);
    }

    @Override
    public void deleteWorkflow(String id) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new WorkflowNotFoundException("Workflow not found with id: " + id));
        workflowRepository.delete(workflow);
    }

    private WorkflowResponse mapToResponse(Workflow workflow) {
        return WorkflowResponse.builder()
                .id(workflow.getId())
                .incidentId(workflow.getIncidentId())
                .workflowName(workflow.getWorkflowName())
                .status(workflow.getStatus())
                .createdBy(workflow.getCreatedBy())
                .createdAt(workflow.getCreatedAt())
                .updatedAt(workflow.getUpdatedAt())
                .build();
    }
}
