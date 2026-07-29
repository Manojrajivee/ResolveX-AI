package com.resolvex.ai.controller;

import com.resolvex.ai.dto.ChatRequest;
import com.resolvex.ai.dto.ChatResponse;
import com.resolvex.ai.model.ChatMessage;
import com.resolvex.ai.model.ChatSession;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<ChatSession>> startSession(
            @RequestParam(required = false) String title,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        ChatSession session = chatService.startSession(userId, title);
        return new ResponseEntity<>(ApiResponse.success("Chat session started successfully", session), HttpStatus.CREATED);
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(
            @Valid @RequestBody ChatRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        ChatResponse response = chatService.sendMessage(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Message sent and processed successfully", response));
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<ChatSession>>> getSessions(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<ChatSession> sessions = chatService.getUserChatSessions(userId);
        return ResponseEntity.ok(ApiResponse.success("Chat sessions retrieved successfully", sessions));
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getHistory(
            @PathVariable String sessionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<ChatMessage> history = chatService.getSessionChatHistory(sessionId, userId);
        return ResponseEntity.ok(ApiResponse.success("Chat history retrieved successfully", history));
    }

    @DeleteMapping("/session/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        chatService.deleteChatSession(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Chat session deleted successfully"));
    }
}
