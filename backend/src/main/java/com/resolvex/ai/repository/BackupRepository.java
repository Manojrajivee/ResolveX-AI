package com.resolvex.ai.repository;

import com.resolvex.ai.model.BackupHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BackupRepository extends MongoRepository<BackupHistory, String> {
    
    Optional<BackupHistory> findByBackupName(String backupName);
}
