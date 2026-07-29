package com.resolvex.ai.repository;

import com.resolvex.ai.model.Notification;
import com.resolvex.ai.model.NotificationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    List<Notification> findByUserId(String userId);
    
    long countByUserIdAndStatus(String userId, NotificationStatus status);
    
    List<Notification> findByStatus(NotificationStatus status);
}
