package com.agroconnect.order.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuditLogService {
    
    public void log(String action, String entity, String entityId) {
        // In a real implementation, this would send the audit log to the audit service
        // For now, we'll just log to console
        System.out.println(String.format(
            "AUDIT LOG: Action=%s, Entity=%s, EntityId=%s, Timestamp=%s, User=%s",
            action,
            entity,
            entityId,
            LocalDateTime.now(),
            getCurrentUser()
        ));
    }
    
    private String getCurrentUser() {
        // In a real implementation, this would get the current authenticated user
        // For now, return a default value
        return "system";
    }
} 