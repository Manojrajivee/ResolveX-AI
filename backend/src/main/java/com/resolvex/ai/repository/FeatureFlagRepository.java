package com.resolvex.ai.repository;

import com.resolvex.ai.model.FeatureFlag;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureFlagRepository extends MongoRepository<FeatureFlag, String> {
    
    Optional<FeatureFlag> findByFeatureName(String featureName);
}
