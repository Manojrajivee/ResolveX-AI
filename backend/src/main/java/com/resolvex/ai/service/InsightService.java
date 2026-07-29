package com.resolvex.ai.service;

import com.resolvex.ai.dto.InsightResponse;

import java.util.List;

public interface InsightService {
    
    List<InsightResponse> getInsights();
    
    void generateNewInsights();
}
