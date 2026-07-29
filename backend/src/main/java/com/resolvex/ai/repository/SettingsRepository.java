package com.resolvex.ai.repository;

import com.resolvex.ai.model.SystemSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends MongoRepository<SystemSettings, String> {
}
