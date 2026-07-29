package com.resolvex.ai.controller;

import com.resolvex.ai.dto.NotificationRequest;
import com.resolvex.ai.dto.NotificationResponse;
import com.resolvex.ai.dto.NotificationHistoryResponse;
import com.resolvex.ai.response.ApiResponse;
import com.resolvex.ai.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> sendNotification(@Valid @RequestBody NotificationRequest request) {
        NotificationResponse response = notificationService.sendNotification(request);
        return new ResponseEntity<>(ApiResponse.success("Notification sent and processed", response), HttpStatus.CREATED);
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<NotificationResponse>> sendNotificationAlias(@Valid @RequestBody NotificationRequest request) {
        NotificationResponse response = notificationService.sendNotification(request);
        return new ResponseEntity<>(ApiResponse.success("Notification sent and processed", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<NotificationHistoryResponse>> getHistory(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<NotificationResponse> history = notificationService.getNotificationHistory(userId);
        long unread = notificationService.getUnreadCount(userId);
        NotificationHistoryResponse response = NotificationHistoryResponse.builder()
                .history(history)
                .totalNotifications(history.size())
                .unreadCount(unread)
                .build();
        return ResponseEntity.ok(ApiResponse.success("Notification history retrieved successfully", response));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully"));
    }
}
