package com.resolvex.ai.service;

import com.resolvex.ai.dto.KnowledgeRequest;
import com.resolvex.ai.dto.KnowledgeResponse;
import com.resolvex.ai.dto.SearchKnowledgeResponse;
import com.resolvex.ai.exception.KnowledgeNotFoundException;
import com.resolvex.ai.model.KnowledgeArticle;
import com.resolvex.ai.repository.KnowledgeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KnowledgeBaseServiceImpl implements KnowledgeBaseService {

    private final KnowledgeRepository knowledgeRepository;
    private final EmbeddingService embeddingService;

    public KnowledgeBaseServiceImpl(
            KnowledgeRepository knowledgeRepository,
            EmbeddingService embeddingService) {
        this.knowledgeRepository = knowledgeRepository;
        this.embeddingService = embeddingService;
    }

    @Override
    public KnowledgeResponse createArticle(KnowledgeRequest request) {
        // Generate embedding vector based on title + problem + solution
        String textToEmbed = request.getTitle() + " " + request.getProblem() + " " + request.getSolution();
        double[] embedding = embeddingService.getEmbedding(textToEmbed);

        KnowledgeArticle article = KnowledgeArticle.builder()
                .title(request.getTitle())
                .problem(request.getProblem())
                .solution(request.getSolution())
                .keywords(request.getKeywords())
                .incidentId(request.getIncidentId())
                .embedding(embedding)
                .build();

        KnowledgeArticle saved = knowledgeRepository.save(article);
        return mapToResponse(saved);
    }

    @Override
    public List<KnowledgeResponse> getAllArticles() {
        return knowledgeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public KnowledgeResponse getArticleById(String id) {
        KnowledgeArticle article = knowledgeRepository.findById(id)
                .orElseThrow(() -> new KnowledgeNotFoundException("Knowledge base article not found with id: " + id));
        return mapToResponse(article);
    }

    @Override
    public KnowledgeResponse updateArticle(String id, KnowledgeRequest request) {
        KnowledgeArticle article = knowledgeRepository.findById(id)
                .orElseThrow(() -> new KnowledgeNotFoundException("Knowledge base article not found with id: " + id));

        article.setTitle(request.getTitle());
        article.setProblem(request.getProblem());
        article.setSolution(request.getSolution());
        article.setKeywords(request.getKeywords());
        article.setIncidentId(request.getIncidentId());

        // Re-generate vector embedding
        String textToEmbed = request.getTitle() + " " + request.getProblem() + " " + request.getSolution();
        double[] embedding = embeddingService.getEmbedding(textToEmbed);
        article.setEmbedding(embedding);

        KnowledgeArticle updated = knowledgeRepository.save(article);
        return mapToResponse(updated);
    }

    @Override
    public void deleteArticle(String id) {
        KnowledgeArticle article = knowledgeRepository.findById(id)
                .orElseThrow(() -> new KnowledgeNotFoundException("Knowledge base article not found with id: " + id));
        knowledgeRepository.delete(article);
    }

    @Override
    public SearchKnowledgeResponse searchKnowledge(String query) {
        if (query == null || query.isBlank()) {
            List<KnowledgeResponse> all = getAllArticles();
            return SearchKnowledgeResponse.builder()
                    .results(all)
                    .totalResults(all.size())
                    .build();
        }

        // Get query embedding vector
        double[] queryEmbedding = embeddingService.getEmbedding(query);
        List<KnowledgeArticle> allArticles = knowledgeRepository.findAll();

        // Compute cosine similarities and sort results
        class ScoredArticle {
            final KnowledgeArticle article;
            final double score;

            ScoredArticle(KnowledgeArticle article, double score) {
                this.article = article;
                this.score = score;
            }
        }

        List<KnowledgeResponse> results = allArticles.stream()
                .map(article -> {
                    double similarity = embeddingService.calculateCosineSimilarity(queryEmbedding, article.getEmbedding());
                    return new ScoredArticle(article, similarity);
                })
                .sorted((a, b) -> Double.compare(b.score, a.score)) // Descending order of similarity
                .map(scored -> mapToResponse(scored.article))
                .collect(Collectors.toList());

        return SearchKnowledgeResponse.builder()
                .results(results)
                .totalResults(results.size())
                .build();
    }

    private KnowledgeResponse mapToResponse(KnowledgeArticle article) {
        return KnowledgeResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .problem(article.getProblem())
                .solution(article.getSolution())
                .keywords(article.getKeywords())
                .incidentId(article.getIncidentId())
                .createdAt(article.getCreatedAt())
                .build();
    }
}
