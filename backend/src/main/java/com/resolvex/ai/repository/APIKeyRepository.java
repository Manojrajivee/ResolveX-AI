package com.resolvex.ai.repository;

import com.resolvex.ai.model.APIKey;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface APIKeyRepository extends MongoRepository<APIKey, String> {
    
    Optional<APIKey> findByApiKey(String apiKey);
}
