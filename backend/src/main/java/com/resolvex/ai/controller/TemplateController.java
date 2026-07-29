package com.resolvex.ai.controller;

import com.resolvex.ai.model.NotificationTemplate;
import com.resolvex.ai.repository.TemplateRepository;
import com.resolvex.ai.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    private final TemplateRepository templateRepository;

    public TemplateController(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY')")
    public ResponseEntity<ApiResponse<List<NotificationTemplate>>> getAllTemplates() {
        List<NotificationTemplate> templates = templateRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Notification templates retrieved successfully", templates));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationTemplate>> createTemplate(@Valid @RequestBody NotificationTemplate template) {
        NotificationTemplate saved = templateRepository.save(template);
        return new ResponseEntity<>(ApiResponse.success("Template created successfully", saved), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationTemplate>> updateTemplate(
            @PathVariable String id,
            @Valid @RequestBody NotificationTemplate request) {
        
        NotificationTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));

        template.setName(request.getName());
        template.setSubject(request.getSubject());
        template.setBody(request.getBody());
        template.setChannel(request.getChannel());

        NotificationTemplate updated = templateRepository.save(template);
        return ResponseEntity.ok(ApiResponse.success("Template updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable String id) {
        NotificationTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
        templateRepository.delete(template);
        return ResponseEntity.ok(ApiResponse.success("Template deleted successfully"));
    }
}
