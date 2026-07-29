package com.resolvex.ai.controller;

import com.resolvex.ai.dto.KnowledgeRequest;
import com.resolvex.ai.dto.KnowledgeResponse;
import com.resolvex.ai.dto.SearchKnowledgeResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.KnowledgeBaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge")
public class KnowledgeBaseController {

    private final KnowledgeBaseService knowledgeBaseService;

    public KnowledgeBaseController(KnowledgeBaseService knowledgeBaseService) {
        this.knowledgeBaseService = knowledgeBaseService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<KnowledgeResponse>> createArticle(@Valid @RequestBody KnowledgeRequest request) {
        KnowledgeResponse response = knowledgeBaseService.createArticle(request);
        return new ResponseEntity<>(ApiResponse.success("Knowledge article created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<KnowledgeResponse>>> getAllArticles() {
        List<KnowledgeResponse> articles = knowledgeBaseService.getAllArticles();
        return ResponseEntity.ok(ApiResponse.success("Knowledge articles retrieved successfully", articles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KnowledgeResponse>> getArticleById(@PathVariable String id) {
        KnowledgeResponse response = knowledgeBaseService.getArticleById(id);
        return ResponseEntity.ok(ApiResponse.success("Knowledge article retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<KnowledgeResponse>> updateArticle(
            @PathVariable String id,
            @Valid @RequestBody KnowledgeRequest request) {
        
        KnowledgeResponse response = knowledgeBaseService.updateArticle(id, request);
        return ResponseEntity.ok(ApiResponse.success("Knowledge article updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable String id) {
        knowledgeBaseService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.success("Knowledge article deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<SearchKnowledgeResponse>> searchKnowledge(@RequestParam String query) {
        SearchKnowledgeResponse response = knowledgeBaseService.searchKnowledge(query);
        return ResponseEntity.ok(ApiResponse.success("Knowledge base searched successfully", response));
    }
}
