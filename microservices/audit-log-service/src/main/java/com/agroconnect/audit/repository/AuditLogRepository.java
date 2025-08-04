package com.agroconnect.audit.repository;

import com.agroconnect.audit.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    
    /**
     * Find audit logs by service name, ordered by timestamp descending
     */
    List<AuditLog> findByServiceNameOrderByTimestampDesc(String serviceName);
    
    /**
     * Find audit logs by username, ordered by timestamp descending
     */
    List<AuditLog> findByUsernameOrderByTimestampDesc(String username);
    
    /**
     * Find audit logs by action, ordered by timestamp descending
     */
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
    
    /**
     * Find audit logs by date range, ordered by timestamp descending
     */
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find all audit logs ordered by timestamp descending
     */
    List<AuditLog> findAllByOrderByTimestampDesc();
    
    /**
     * Count audit logs by service name
     */
    long countByServiceName(String serviceName);
    
    /**
     * Count audit logs by username
     */
    long countByUsername(String username);
    
    /**
     * Count audit logs by action
     */
    long countByAction(String action);
} 