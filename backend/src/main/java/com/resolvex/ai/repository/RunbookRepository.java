package com.resolvex.ai.repository;

import com.resolvex.ai.model.Runbook;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RunbookRepository extends MongoRepository<Runbook, String> {
    
    List<Runbook> findByUploadedBy(String uploadedBy);
}
