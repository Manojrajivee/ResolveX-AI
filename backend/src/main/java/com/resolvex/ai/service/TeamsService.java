package com.resolvex.ai.service;

import com.resolvex.ai.dto.TeamsRequest;

public interface TeamsService {
    
    void sendTeamsMessage(TeamsRequest request);
}
