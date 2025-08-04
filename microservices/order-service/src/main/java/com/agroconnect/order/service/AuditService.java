package com.agroconnect.order.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuditService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    
    @Autowired
    private RestTemplate restTemplate;
    
    private static final String AUDIT_SERVICE_URL = "http://audit-log-service:8084/api/audit/log";
    
    /**
     * Log an audit event
     */
    public void log(String username, String action, String details) {
        log(username, action, details, null, null, null);
    }
    
    /**
     * Log an audit event with additional context
     */
    public void log(String username, String action, String details, String ipAddress, String userAgent, String requestId) {
        try {
            Map<String, String> auditRequest = new HashMap<>();
            auditRequest.put("serviceName", "order-service");
            auditRequest.put("username", username != null ? username : "system");
            auditRequest.put("action", action);
            auditRequest.put("details", details);
            auditRequest.put("ipAddress", ipAddress);
            auditRequest.put("userAgent", userAgent);
            auditRequest.put("requestId", requestId);
            
            // Send to audit service
            restTemplate.postForEntity(AUDIT_SERVICE_URL, auditRequest, Object.class);
            
            // Also log locally to file
            logger.info("AUDIT_LOG: {} | order-service | {} | {} | {} | {} | {}", 
                LocalDateTime.now(), username, action, details, ipAddress, requestId);
                
        } catch (Exception e) {
            logger.error("Failed to send audit log to audit service: {}", e.getMessage());
            // Still log locally even if audit service is down
            logger.info("AUDIT_LOG_LOCAL: {} | order-service | {} | {} | {} | {} | {}", 
                LocalDateTime.now(), username, action, details, ipAddress, requestId);
        }
    }
    
    /**
     * Log order creation
     */
    public void logOrderCreated(String username, String orderId, String customerName) {
        log(username, "CREATE_ORDER", "Created order: " + orderId + " for customer: " + customerName);
    }
    
    /**
     * Log order update
     */
    public void logOrderUpdated(String username, String orderId, String status) {
        log(username, "UPDATE_ORDER", "Updated order: " + orderId + " status to: " + status);
    }
    
    /**
     * Log order cancellation
     */
    public void logOrderCancelled(String username, String orderId) {
        log(username, "CANCEL_ORDER", "Cancelled order: " + orderId);
    }
    
    /**
     * Log order completion
     */
    public void logOrderCompleted(String username, String orderId) {
        log(username, "COMPLETE_ORDER", "Completed order: " + orderId);
    }
    
    /**
     * Log order view
     */
    public void logOrderViewed(String username, String orderId) {
        log(username, "VIEW_ORDER", "Viewed order: " + orderId);
    }
} 