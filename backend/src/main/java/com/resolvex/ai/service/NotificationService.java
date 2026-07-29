package com.resolvex.ai.service;

import com.resolvex.ai.dto.NotificationRequest;
import com.resolvex.ai.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {
    
    NotificationResponse sendNotification(NotificationRequest request);
    
    List<NotificationResponse> getNotificationHistory(String userId);
    
    long getUnreadCount(String userId);
    
    void markAsRead(String id, String userId);
    
    void deleteNotification(String id, String userId);
    
    void retryFailedNotifications();
}
