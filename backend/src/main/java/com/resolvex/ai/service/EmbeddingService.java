package com.resolvex.ai.service;

public interface EmbeddingService {
    
    double[] getEmbedding(String text);
    
    double calculateCosineSimilarity(double[] vectorA, double[] vectorB);
}
