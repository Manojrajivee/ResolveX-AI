package com.resolvex.ai.service;

import com.resolvex.ai.dto.EscalationRequest;
import com.resolvex.ai.dto.EscalationResponse;

import java.util.List;

public interface EscalationService {
    
    EscalationResponse escalateIncident(EscalationRequest request);
    
    List<EscalationResponse> getEscalationsForIncident(String incidentId);
    
    List<EscalationResponse> getEscalationsByManager(String managerEmail);
}
