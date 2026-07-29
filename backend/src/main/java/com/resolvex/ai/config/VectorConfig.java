package com.resolvex.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VectorConfig {

    @Value("${app.vector.embedding-url:https://api.openai.com/v1/embeddings}")
    private String embeddingUrl;

    @Value("${app.vector.embedding-model:text-embedding-3-small}")
    private String embeddingModel;

    public String getEmbeddingUrl() {
        return embeddingUrl;
    }

    public String getEmbeddingModel() {
        return embeddingModel;
    }
}
