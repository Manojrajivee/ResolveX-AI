package com.resolvex.ai.repository;

import com.resolvex.ai.model.Dashboard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DashboardRepository extends MongoRepository<Dashboard, String> {
    
    Optional<Dashboard> findByName(String name);
}
