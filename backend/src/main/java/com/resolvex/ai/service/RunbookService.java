package com.resolvex.ai.service;

import com.resolvex.ai.dto.RunbookResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RunbookService {
    
    RunbookResponse uploadRunbook(String title, MultipartFile file, String uploadedBy);
    
    List<RunbookResponse> getAllRunbooks();
    
    RunbookResponse getRunbookMetadata(String id);
    
    Resource downloadRunbookFile(String id);
    
    void deleteRunbook(String id);
}
