package com.resolvex.ai.repository;

import com.resolvex.ai.model.Assignment;
import com.resolvex.ai.model.AssignmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    
    List<Assignment> findByIncidentId(String incidentId);
    
    List<Assignment> findByEngineerId(String engineerId);
    
    List<Assignment> findByStatus(AssignmentStatus status);
}
