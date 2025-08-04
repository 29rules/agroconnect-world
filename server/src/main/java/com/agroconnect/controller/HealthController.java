package com.agroconnect.controller;

import com.agroconnect.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Health check controller
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@RestController
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    /**
     * GET /health - Simple health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        logger.debug("Health check requested");
        
        Map<String, Object> healthStatus = Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", "AgroConnect World API",
            "version", "1.0.0"
        );
        
        return ResponseEntity.ok(ApiResponse.success("Service is healthy", healthStatus));
    }
} 