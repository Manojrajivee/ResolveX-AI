package com.resolvex.ai.service;

import com.resolvex.ai.config.AIConfig;
import com.resolvex.ai.config.OpenAIConfig;
import com.resolvex.ai.dto.*;
import com.resolvex.ai.exception.ChatException;
import com.resolvex.ai.model.ChatMessage;
import com.resolvex.ai.model.ChatSession;
import com.resolvex.ai.model.Incident;
import com.resolvex.ai.repository.ChatMessageRepository;
import com.resolvex.ai.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final KnowledgeBaseService knowledgeBaseService;
    private final MongoTemplate mongoTemplate;
    private final OpenAIConfig openAIConfig;
    private final AIConfig aiConfig;
    private final RestTemplate restTemplate;

    public ChatServiceImpl(
            ChatRepository chatRepository,
            ChatMessageRepository chatMessageRepository,
            KnowledgeBaseService knowledgeBaseService,
            MongoTemplate mongoTemplate,
            OpenAIConfig openAIConfig,
            AIConfig aiConfig,
            @Qualifier("openaiRestTemplate") RestTemplate restTemplate) {
        this.chatRepository = chatRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.knowledgeBaseService = knowledgeBaseService;
        this.mongoTemplate = mongoTemplate;
        this.openAIConfig = openAIConfig;
        this.aiConfig = aiConfig;
        this.restTemplate = restTemplate;
    }

    @Override
    public ChatSession startSession(String userId, String title) {
        ChatSession session = ChatSession.builder()
                .userId(userId)
                .title(title == null || title.isBlank() ? "New Troubleshooting Session" : title)
                .build();
        return chatRepository.save(session);
    }

    @Override
    public ChatResponse sendMessage(ChatRequest request, String userId) {
        ChatSession session = chatRepository.findById(request.getSessionId())
                .orElseThrow(() -> new ChatException("Chat session not found with id: " + request.getSessionId()));

        if (!session.getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to send messages in this session");
        }

        // Fetch conversation history
        List<ChatMessage> history = chatMessageRepository.findBySessionIdOrderByTimestampAsc(request.getSessionId());

        // Perform semantic search on Knowledge Base (RAG)
        SearchKnowledgeResponse kbSearch = knowledgeBaseService.searchKnowledge(request.getMessage());
        List<KnowledgeResponse> articles = kbSearch.getResults().stream().limit(3).collect(Collectors.toList());

        // Search for relevant past incidents
        Query query = new Query();
        // Regex check across title and description keywords
        String cleanQuery = request.getMessage().replaceAll("[^a-zA-Z0-9 ]", "");
        Criteria criteria = new Criteria().orOperator(
                Criteria.where("title").regex(cleanQuery, "i"),
                Criteria.where("description").regex(cleanQuery, "i")
        );
        query.addCriteria(criteria);
        List<Incident> relevantIncidents = mongoTemplate.find(query.limit(2), Incident.class);

        // Call OpenAI to get AI Response (RAG Prompt construction)
        String aiResponseText;
        if (openAIConfig.getApiKey() == null || openAIConfig.getApiKey().isBlank()) {
            aiResponseText = buildLocalFallbackResponse(request.getMessage(), articles, relevantIncidents);
        } else {
            try {
                aiResponseText = callOpenAIChatAPI(request.getMessage(), history, articles, relevantIncidents);
            } catch (Exception ex) {
                System.err.println("AI Chat Service Call Failed: " + ex.getMessage());
                aiResponseText = buildLocalFallbackResponse(request.getMessage(), articles, relevantIncidents) 
                        + "\n\n*(Note: Fallback invoked due to OpenAI API connection issue)*";
            }
        }

        // Save conversation message log
        ChatMessage chatMessage = ChatMessage.builder()
                .sessionId(request.getSessionId())
                .role("USER")
                .message(request.getMessage())
                .aiResponse(aiResponseText)
                .build();

        chatMessageRepository.save(chatMessage);

        return ChatResponse.builder()
                .sessionId(session.getId())
                .message(request.getMessage())
                .aiResponse(aiResponseText)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public List<ChatSession> getUserChatSessions(String userId) {
        return chatRepository.findByUserId(userId);
    }

    @Override
    public List<ChatMessage> getSessionChatHistory(String sessionId, String userId) {
        ChatSession session = chatRepository.findById(sessionId)
                .orElseThrow(() -> new ChatException("Chat session not found with id: " + sessionId));

        if (!session.getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to view this session's history");
        }

        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    @Override
    public void deleteChatSession(String id, String userId) {
        ChatSession session = chatRepository.findById(id)
                .orElseThrow(() -> new ChatException("Chat session not found with id: " + id));

        if (!session.getUserId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to delete this session");
        }

        chatMessageRepository.deleteBySessionId(id);
        chatRepository.delete(session);
    }

    private String callOpenAIChatAPI(String userQuestion, List<ChatMessage> history,
                                     List<KnowledgeResponse> articles, List<Incident> incidents) {
        // Construct RAG Context
        StringBuilder context = new StringBuilder();
        context.append("### CONTEXT INFORMATION ###\n");
        if (!articles.isEmpty()) {
            context.append("\n-- RELEVANT KNOWLEDGE BASE ARTICLES --\n");
            for (int i = 0; i < articles.size(); i++) {
                KnowledgeResponse art = articles.get(i);
                context.append(String.format("[%d] Title: %s\nProblem: %s\nSolution: %s\nKeywords: %s\n\n",
                        i + 1, art.getTitle(), art.getProblem(), art.getSolution(), art.getKeywords()));
            }
        }
        if (!incidents.isEmpty()) {
            context.append("\n-- PAST INCIDENTS & HISTORICAL FIXES --\n");
            for (int i = 0; i < incidents.size(); i++) {
                Incident inc = incidents.get(i);
                context.append(String.format("[%d] Title: %s\nDescription: %s\nRoot Cause: %s\nSuggested Fix: %s\n\n",
                        i + 1, inc.getTitle(), inc.getDescription(), inc.getRootCause(), inc.getSuggestedFix()));
            }
        }

        // Map payload messages
        List<Map<String, String>> apiMessages = new ArrayList<>();
        
        // System System Instruction
        String systemInstruction = aiConfig.getSystemPrompt() + "\n\n" + context.toString() + 
                "\nFormat your response clearly. Include sections: Explanation, Possible Root Cause, Suggested Fix, Recommended Commands (if any), and References.";
        
        apiMessages.add(Map.of("role", "system", "content", systemInstruction));

        // Format Chat History
        for (ChatMessage msg : history) {
            apiMessages.add(Map.of("role", "user", "content", msg.getMessage()));
            if (msg.getAiResponse() != null) {
                apiMessages.add(Map.of("role", "assistant", "content", msg.getAiResponse()));
            }
        }

        // Add current question
        apiMessages.add(Map.of("role", "user", "content", userQuestion));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", openAIConfig.getModel());
        requestBody.put("temperature", aiConfig.getTemperature());
        requestBody.put("messages", apiMessages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody);
        ResponseEntity<Map> response = restTemplate.postForEntity(openAIConfig.getApiUrl(), entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> choice = choices.get(0);
                Map<String, Object> message = (Map<String, Object>) choice.get("message");
                if (message != null) {
                    return (String) message.get("content");
                }
            }
        }
        throw new RuntimeException("Invalid response schema returned from OpenAI completions endpoint");
    }

    private String buildLocalFallbackResponse(String question, List<KnowledgeResponse> articles, List<Incident> incidents) {
        StringBuilder sb = new StringBuilder();
        sb.append("### ResolveX AI Chat Assistant (Local Offline Mode)\n\n");
        sb.append("OpenAI API Key is not configured. I retrieved matching records from your local knowledge base and history to help troubleshooting:\n\n");

        if (articles.isEmpty() && incidents.isEmpty()) {
            sb.append("I searched the knowledge base but couldn't find any relevant articles or past incidents matching: *\"").append(question).append("\"*\n\n");
            sb.append("#### Suggested Actions:\n");
            sb.append("1. Verify the spelling of keywords in your question.\n");
            sb.append("2. Create a new Knowledge Base article for this issue to assist future troubleshooting.\n");
            return sb.toString();
        }

        if (!articles.isEmpty()) {
            sb.append("#### 📚 Relevant Knowledge Base Matches:\n");
            for (KnowledgeResponse art : articles) {
                sb.append(String.format("- **%s**\n", art.getTitle()));
                sb.append(String.format("  - *Problem:* %s\n", art.getProblem()));
                sb.append(String.format("  - *Solution:* %s\n\n", art.getSolution()));
            }
        }

        if (!incidents.isEmpty()) {
            sb.append("#### 🛠️ Relevant Historical Incidents:\n");
            for (Incident inc : incidents) {
                sb.append(String.format("- **%s** (%s)\n", inc.getTitle(), inc.getStatus()));
                if (inc.getRootCause() != null) {
                    sb.append(String.format("  - *Root Cause:* %s\n", inc.getRootCause()));
                }
                if (inc.getSuggestedFix() != null) {
                    sb.append(String.format("  - *Suggested Fix:* %s\n\n", inc.getSuggestedFix()));
                }
            }
        }

        sb.append("\n*Please configure `app.openai.api-key` in `application.properties` to enable full LLM troubleshooting reasoning.*");
        return sb.toString();
    }
}
