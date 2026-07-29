package com.resolvex.ai.repository;

import com.resolvex.ai.model.IncidentReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends MongoRepository<IncidentReport, String> {

    List<IncidentReport> findByUserId(String userId);

    Optional<IncidentReport> findByIdAndUserId(String id, String userId);
}
