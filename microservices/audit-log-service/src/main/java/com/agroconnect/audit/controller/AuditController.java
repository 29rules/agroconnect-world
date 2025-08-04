package com.agroconnect.audit.controller;

import com.agroconnect.audit.model.AuditLog;
import com.agroconnect.audit.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditController {
    
    @Autowired
    private AuditService auditService;
    
    /**
     * Create a new audit log entry
     */
    @PostMapping("/log")
    public ResponseEntity<AuditLog> createAuditLog(@RequestBody Map<String, String> request) {
        String serviceName = request.get("serviceName");
        String username = request.get("username");
        String action = request.get("action");
        String details = request.get("details");
        String ipAddress = request.get("ipAddress");
        String userAgent = request.get("userAgent");
        String requestId = request.get("requestId");
        
        AuditLog auditLog = auditService.log(serviceName, username, action, details, ipAddress, userAgent, requestId);
        return ResponseEntity.ok(auditLog);
    }
    
    /**
     * Get all audit logs
     */
    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        List<AuditLog> logs = auditService.findAll();
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get audit logs by service name
     */
    @GetMapping("/logs/service/{serviceName}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByService(@PathVariable String serviceName) {
        List<AuditLog> logs = auditService.findByServiceName(serviceName);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get audit logs by username
     */
    @GetMapping("/logs/user/{username}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByUser(@PathVariable String username) {
        List<AuditLog> logs = auditService.findByUsername(username);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get audit logs by action
     */
    @GetMapping("/logs/action/{action}")
    public ResponseEntity<List<AuditLog>> getAuditLogsByAction(@PathVariable String action) {
        List<AuditLog> logs = auditService.findByAction(action);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get audit logs by date range
     */
    @GetMapping("/logs/range")
    public ResponseEntity<List<AuditLog>> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AuditLog> logs = auditService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get audit log by ID
     */
    @GetMapping("/logs/{id}")
    public ResponseEntity<AuditLog> getAuditLogById(@PathVariable String id) {
        return auditService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Delete audit log by ID
     */
    @DeleteMapping("/logs/{id}")
    public ResponseEntity<Void> deleteAuditLog(@PathVariable String id) {
        auditService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get audit statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAuditStats() {
        Map<String, Object> stats = Map.of(
            "totalLogs", auditService.getTotalAuditLogs(),
            "productServiceLogs", auditService.getAuditLogsCountByService("product-service"),
            "orderServiceLogs", auditService.getAuditLogsCountByService("order-service"),
            "userServiceLogs", auditService.getAuditLogsCountByService("user-service"),
            "auditServiceLogs", auditService.getAuditLogsCountByService("audit-service")
        );
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "audit-log-service"));
    }
} 