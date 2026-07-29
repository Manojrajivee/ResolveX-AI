package com.resolvex.ai.repository;

import com.resolvex.ai.model.Escalation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalationRepository extends MongoRepository<Escalation, String> {
    
    List<Escalation> findByIncidentId(String incidentId);
    
    List<Escalation> findByAssignedManager(String assignedManager);
}
