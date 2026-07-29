package com.resolvex.ai.service;

import com.resolvex.ai.dto.KnowledgeRequest;
import com.resolvex.ai.dto.KnowledgeResponse;
import com.resolvex.ai.dto.SearchKnowledgeResponse;

import java.util.List;

public interface KnowledgeBaseService {
    
    KnowledgeResponse createArticle(KnowledgeRequest request);
    
    List<KnowledgeResponse> getAllArticles();
    
    KnowledgeResponse getArticleById(String id);
    
    KnowledgeResponse updateArticle(String id, KnowledgeRequest request);
    
    void deleteArticle(String id);
    
    SearchKnowledgeResponse searchKnowledge(String query);
}
