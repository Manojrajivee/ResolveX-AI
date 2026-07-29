package com.resolvex.ai.service;

import com.resolvex.ai.config.OpenAIConfig;
import com.resolvex.ai.config.VectorConfig;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingServiceImpl implements EmbeddingService {

    private final OpenAIConfig openAIConfig;
    private final VectorConfig vectorConfig;
    private final RestTemplate restTemplate;

    public EmbeddingServiceImpl(
            OpenAIConfig openAIConfig,
            VectorConfig vectorConfig,
            @Qualifier("openaiRestTemplate") RestTemplate restTemplate) {
        this.openAIConfig = openAIConfig;
        this.vectorConfig = vectorConfig;
        this.restTemplate = restTemplate;
    }

    @Override
    public double[] getEmbedding(String text) {
        if (text == null || text.isBlank()) {
            return new double[1536];
        }

        // Fallback if API key is not configured
        if (openAIConfig.getApiKey() == null || openAIConfig.getApiKey().isBlank()) {
            return generateMockEmbedding(text);
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("input", text);
            requestBody.put("model", vectorConfig.getEmbeddingModel());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody);
            ResponseEntity<Map> response = restTemplate.postForEntity(vectorConfig.getEmbeddingUrl(), entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");
                if (data != null && !data.isEmpty()) {
                    List<Double> embeddingList = (List<Double>) data.get(0).get("embedding");
                    if (embeddingList != null) {
                        double[] embedding = new double[embeddingList.size()];
                        for (int i = 0; i < embeddingList.size(); i++) {
                            embedding[i] = embeddingList.get(i);
                        }
                        return embedding;
                    }
                }
            }
            throw new RuntimeException("Empty response received from OpenAI Embeddings endpoint");
        } catch (Exception ex) {
            System.err.println("Warning: OpenAI Embeddings API call failed, falling back to mock embedding: " + ex.getMessage());
            return generateMockEmbedding(text);
        }
    }

    @Override
    public double calculateCosineSimilarity(double[] vectorA, double[] vectorB) {
        if (vectorA == null || vectorB == null || vectorA.length != vectorB.length) {
            return 0.0;
        }
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }
        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private double[] generateMockEmbedding(String text) {
        // Generate a deterministic mock 1536-dimension normalized vector based on character features
        double[] mockVector = new double[1536];
        int textHash = text.hashCode();
        for (int i = 0; i < mockVector.length; i++) {
            mockVector[i] = Math.sin(textHash + i);
        }
        // Normalize the vector
        double sumSquare = 0.0;
        for (double val : mockVector) {
            sumSquare += val * val;
        }
        double magnitude = Math.sqrt(sumSquare);
        if (magnitude > 0) {
            for (int i = 0; i < mockVector.length; i++) {
                mockVector[i] /= magnitude;
            }
        }
        return mockVector;
    }
}
