package com.resolvex.ai.repository;

import com.resolvex.ai.model.SystemRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<SystemRole, String> {
    
    Optional<SystemRole> findByName(String name);
}
