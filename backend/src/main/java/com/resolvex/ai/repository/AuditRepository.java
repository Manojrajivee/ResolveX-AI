package com.resolvex.ai.repository;

import com.resolvex.ai.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRepository extends MongoRepository<AuditLog, String> {
    
    List<AuditLog> findByUserId(String userId);
    
    List<AuditLog> findByModule(String module);
}
