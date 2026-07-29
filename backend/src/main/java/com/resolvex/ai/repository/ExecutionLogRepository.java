package com.resolvex.ai.repository;

import com.resolvex.ai.model.ExecutionLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExecutionLogRepository extends MongoRepository<ExecutionLog, String> {
    
    List<ExecutionLog> findByStatus(String status);
}
