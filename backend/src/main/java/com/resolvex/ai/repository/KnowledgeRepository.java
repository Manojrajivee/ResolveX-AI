package com.resolvex.ai.repository;

import com.resolvex.ai.model.KnowledgeArticle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeRepository extends MongoRepository<KnowledgeArticle, String> {
    
    List<KnowledgeArticle> findByIncidentId(String incidentId);
}
