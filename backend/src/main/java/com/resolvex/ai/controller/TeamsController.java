package com.resolvex.ai.controller;

import com.resolvex.ai.dto.TeamsRequest;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.TeamsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
public class TeamsController {

    private final TeamsService teamsService;

    public TeamsController(TeamsService teamsService) {
        this.teamsService = teamsService;
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendTeamsMessage(@Valid @RequestBody TeamsRequest request) {
        teamsService.sendTeamsMessage(request);
        return ResponseEntity.ok(ApiResponse.success("Teams message sent successfully"));
    }
}
