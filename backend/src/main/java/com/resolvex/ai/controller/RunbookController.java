package com.resolvex.ai.controller;

import com.resolvex.ai.dto.RunbookResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.RunbookService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/runbook")
public class RunbookController {

    private final RunbookService runbookService;

    public RunbookController(RunbookService runbookService) {
        this.runbookService = runbookService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<RunbookResponse>> uploadRunbook(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String uploadedBy = userDetails.getUsername();
        RunbookResponse response = runbookService.uploadRunbook(title, file, uploadedBy);
        return new ResponseEntity<>(ApiResponse.success("Runbook uploaded successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RunbookResponse>>> getAllRunbooks() {
        List<RunbookResponse> runbooks = runbookService.getAllRunbooks();
        return ResponseEntity.ok(ApiResponse.success("Runbooks retrieved successfully", runbooks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RunbookResponse>> getRunbook(@PathVariable String id) {
        RunbookResponse runbook = runbookService.getRunbookMetadata(id);
        return ResponseEntity.ok(ApiResponse.success("Runbook retrieved successfully", runbook));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadRunbook(@PathVariable String id) {
        Resource resource = runbookService.downloadRunbookFile(id);
        RunbookResponse metadata = runbookService.getRunbookMetadata(id);
        
        String contentType = metadata.getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRunbook(@PathVariable String id) {
        runbookService.deleteRunbook(id);
        return ResponseEntity.ok(ApiResponse.success("Runbook deleted successfully"));
    }
}
