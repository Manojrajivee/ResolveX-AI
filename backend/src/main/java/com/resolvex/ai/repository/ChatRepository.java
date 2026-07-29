package com.resolvex.ai.repository;

import com.resolvex.ai.model.ChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends MongoRepository<ChatSession, String> {
    
    List<ChatSession> findByUserId(String userId);
}
