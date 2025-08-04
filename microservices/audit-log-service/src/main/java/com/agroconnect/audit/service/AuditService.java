package com.agroconnect.audit.service;

import com.agroconnect.audit.model.AuditLog;
import com.agroconnect.audit.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuditService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    /**
     * Log an audit event
     */
    public AuditLog log(String serviceName, String username, String action, String details) {
        return log(serviceName, username, action, details, null, null, null);
    }
    
    /**
     * Log an audit event with additional context
     */
    public AuditLog log(String serviceName, String username, String action, String details, 
                       String ipAddress, String userAgent, String requestId) {
        try {
            AuditLog auditLog = new AuditLog(serviceName, username, action, details);
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setRequestId(requestId);
            
            AuditLog savedLog = auditLogRepository.save(auditLog);
            
            // Log to file as well
            logger.info("AUDIT_LOG: {} | {} | {} | {} | {} | {} | {}", 
                savedLog.getTimestamp(), serviceName, username, action, details, ipAddress, requestId);
            
            return savedLog;
        } catch (Exception e) {
            logger.error("Failed to save audit log: {}", e.getMessage(), e);
            // Still log to file even if DB save fails
            logger.info("AUDIT_LOG_FAILED: {} | {} | {} | {} | {} | {} | {}", 
                LocalDateTime.now(), serviceName, username, action, details, ipAddress, requestId);
            throw e;
        }
    }
    
    /**
     * Find audit logs by service name
     */
    public List<AuditLog> findByServiceName(String serviceName) {
        return auditLogRepository.findByServiceNameOrderByTimestampDesc(serviceName);
    }
    
    /**
     * Find audit logs by username
     */
    public List<AuditLog> findByUsername(String username) {
        return auditLogRepository.findByUsernameOrderByTimestampDesc(username);
    }
    
    /**
     * Find audit logs by action
     */
    public List<AuditLog> findByAction(String action) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action);
    }
    
    /**
     * Find audit logs by date range
     */
    public List<AuditLog> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(startDate, endDate);
    }
    
    /**
     * Get all audit logs (paginated)
     */
    public List<AuditLog> findAll() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
    
    /**
     * Get audit log by ID
     */
    public Optional<AuditLog> findById(String id) {
        return auditLogRepository.findById(id);
    }
    
    /**
     * Delete audit log by ID
     */
    public void deleteById(String id) {
        auditLogRepository.deleteById(id);
        logger.info("AUDIT_LOG_DELETED: {}", id);
    }
    
    /**
     * Get audit statistics
     */
    public long getTotalAuditLogs() {
        return auditLogRepository.count();
    }
    
    /**
     * Get audit logs count by service
     */
    public long getAuditLogsCountByService(String serviceName) {
        return auditLogRepository.countByServiceName(serviceName);
    }
} 