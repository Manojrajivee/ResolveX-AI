package com.resolvex.ai.repository;

import com.resolvex.ai.model.NotificationTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TemplateRepository extends MongoRepository<NotificationTemplate, String> {
    
    Optional<NotificationTemplate> findByName(String name);
}
