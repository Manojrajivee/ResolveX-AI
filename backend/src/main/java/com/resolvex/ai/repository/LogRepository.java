package com.resolvex.ai.repository;

import com.resolvex.ai.model.SystemLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends MongoRepository<SystemLog, String> {
    
    List<SystemLog> findBySource(String source);
    
    List<SystemLog> findByLevel(String level);
}
