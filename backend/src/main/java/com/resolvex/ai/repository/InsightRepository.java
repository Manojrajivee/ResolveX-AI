package com.resolvex.ai.repository;

import com.resolvex.ai.model.Insight;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsightRepository extends MongoRepository<Insight, String> {
    
    List<Insight> findByGeneratedByAI(boolean generatedByAI);
}
