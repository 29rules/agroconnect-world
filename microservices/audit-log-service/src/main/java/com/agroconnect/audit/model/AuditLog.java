package com.agroconnect.audit.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "audit_logs")
public class AuditLog {
    
    @Id
    private String id;
    private String serviceName;
    private String username;
    private String action;
    private String details;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String userAgent;
    private String requestId;
    
    // Default constructor
    public AuditLog() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor with required fields
    public AuditLog(String serviceName, String username, String action, String details) {
        this();
        this.serviceName = serviceName;
        this.username = username;
        this.action = action;
        this.details = details;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getServiceName() {
        return serviceName;
    }
    
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
    
    public String getDetails() {
        return details;
    }
    
    public void setDetails(String details) {
        this.details = details;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public String getUserAgent() {
        return userAgent;
    }
    
    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
    
    public String getRequestId() {
        return requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }
    
    @Override
    public String toString() {
        return String.format("AuditLog{id='%s', serviceName='%s', username='%s', action='%s', details='%s', timestamp=%s}",
                id, serviceName, username, action, details, timestamp);
    }
} 