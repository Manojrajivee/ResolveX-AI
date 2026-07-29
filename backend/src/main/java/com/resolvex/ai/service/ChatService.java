package com.resolvex.ai.service;

import com.resolvex.ai.dto.ChatRequest;
import com.resolvex.ai.dto.ChatResponse;
import com.resolvex.ai.model.ChatMessage;
import com.resolvex.ai.model.ChatSession;

import java.util.List;

public interface ChatService {
    
    ChatSession startSession(String userId, String title);
    
    ChatResponse sendMessage(ChatRequest request, String userId);
    
    List<ChatSession> getUserChatSessions(String userId);
    
    List<ChatMessage> getSessionChatHistory(String sessionId, String userId);
    
    void deleteChatSession(String id, String userId);
}
