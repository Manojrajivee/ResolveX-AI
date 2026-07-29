package com.resolvex.ai.service;

import com.resolvex.ai.dto.RunbookResponse;
import com.resolvex.ai.exception.ResourceNotFoundException;
import com.resolvex.ai.model.Runbook;
import com.resolvex.ai.repository.RunbookRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RunbookServiceImpl implements RunbookService {

    private final RunbookRepository runbookRepository;
    private final Path fileStorageLocation;

    public RunbookServiceImpl(RunbookRepository runbookRepository,
                              @Value("${app.upload.dir:uploads/runbooks}") String uploadDir) {
        this.runbookRepository = runbookRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public RunbookResponse uploadRunbook(String title, MultipartFile file, String uploadedBy) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String contentType = file.getContentType();
        String originalFileName = file.getOriginalFilename();
        
        // Basic validation: PDF or Markdown
        if (originalFileName == null || 
                (!originalFileName.toLowerCase().endsWith(".pdf") && 
                 !originalFileName.toLowerCase().endsWith(".md") &&
                 !originalFileName.toLowerCase().endsWith(".markdown"))) {
            throw new IllegalArgumentException("Only PDF and Markdown files are allowed");
        }

        // Clean path and generate unique name
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");
        
        try {
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String finalTitle = (title == null || title.isBlank()) ? originalFileName : title;

            Runbook runbook = Runbook.builder()
                    .title(finalTitle)
                    .uploadedBy(uploadedBy)
                    .fileName(originalFileName)
                    .filePath(targetLocation.toString())
                    .fileSize(file.getSize())
                    .contentType(contentType)
                    .build();

            Runbook savedRunbook = runbookRepository.save(runbook);
            return mapToResponse(savedRunbook);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }

    @Override
    public List<RunbookResponse> getAllRunbooks() {
        return runbookRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RunbookResponse getRunbookMetadata(String id) {
        Runbook runbook = runbookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Runbook not found with id: " + id));
        return mapToResponse(runbook);
    }

    @Override
    public Resource downloadRunbookFile(String id) {
        Runbook runbook = runbookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Runbook not found with id: " + id));

        try {
            Path filePath = Paths.get(runbook.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found or not readable: " + runbook.getFileName());
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File path is invalid: " + runbook.getFileName());
        }
    }

    @Override
    public void deleteRunbook(String id) {
        Runbook runbook = runbookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Runbook not found with id: " + id));

        try {
            Path filePath = Paths.get(runbook.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            System.err.println("Warning: could not delete file from disk: " + runbook.getFilePath());
        }

        runbookRepository.delete(runbook);
    }

    private RunbookResponse mapToResponse(Runbook runbook) {
        return RunbookResponse.builder()
                .id(runbook.getId())
                .title(runbook.getTitle())
                .uploadedBy(runbook.getUploadedBy())
                .fileName(runbook.getFileName())
                .uploadDate(runbook.getUploadDate())
                .fileSize(runbook.getFileSize())
                .contentType(runbook.getContentType())
                .build();
    }
}
