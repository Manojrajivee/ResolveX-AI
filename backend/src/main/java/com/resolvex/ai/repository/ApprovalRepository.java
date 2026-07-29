package com.resolvex.ai.repository;

import com.resolvex.ai.model.Approval;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalRepository extends MongoRepository<Approval, String> {
    
    List<Approval> findByWorkflowId(String workflowId);
    
    List<Approval> findByApproverId(String approverId);
}
