package com.resolvex.ai.repository;

import com.resolvex.ai.model.Workflow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowRepository extends MongoRepository<Workflow, String> {
    
    List<Workflow> findByIncidentId(String incidentId);
    
    List<Workflow> findByCreatedBy(String createdBy);
}
