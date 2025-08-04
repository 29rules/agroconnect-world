package com.agroconnect.controller;

import com.agroconnect.ai.AIService;
import com.agroconnect.dto.ApiResponse;
import com.agroconnect.dto.ChatMessage;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for chat functionality with OpenAI integration
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://agroconnect-world.com"})
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final AIService aiService;

    @Autowired
    public ChatController(AIService aiService) {
        this.aiService = aiService;
    }

    /**
     * POST /api/chat/message - Send a message to OpenAI and get response
     */
    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatMessage.ChatResponse>> sendMessage(
            @Valid @RequestBody ChatMessageRequest request) {
        
        logger.info("Received chat message request: {}", request.getMessage().substring(0, Math.min(request.getMessage().length(), 50)) + "...");

        try {
            return aiService.sendMessage(request.getMessage())
                    .map(response -> ResponseEntity.ok(ApiResponse.success("Message processed successfully", response)))
                    .block();
        } catch (Exception e) {
            logger.error("Error processing chat message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process message. Please try again."));
        }
    }

    /**
     * POST /api/chat/simple - Send a message and get simple text response
     */
    @PostMapping("/simple")
    public ResponseEntity<ApiResponse<String>> sendSimpleMessage(
            @Valid @RequestBody ChatMessageRequest request) {
        
        logger.info("Received simple chat message request");

        try {
            return aiService.sendMessageAndGetResponse(request.getMessage())
                    .map(response -> ResponseEntity.ok(ApiResponse.success("Message processed successfully", response)))
                    .block();
        } catch (Exception e) {
            logger.error("Error processing simple chat message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process message. Please try again."));
        }
    }

    /**
     * POST /api/chat/agricultural-advice - Get agricultural advice
     */
    @PostMapping("/agricultural-advice")
    public ResponseEntity<ApiResponse<String>> getAgriculturalAdvice(
            @Valid @RequestBody ChatMessageRequest request) {
        
        logger.info("Received agricultural advice request");

        try {
            return aiService.getAgriculturalAdvice(request.getMessage())
                    .map(response -> ResponseEntity.ok(ApiResponse.success("Agricultural advice provided", response)))
                    .block();
        } catch (Exception e) {
            logger.error("Error providing agricultural advice: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to provide agricultural advice. Please try again."));
        }
    }

    /**
     * POST /api/chat/technical-support - Get technical support
     */
    @PostMapping("/technical-support")
    public ResponseEntity<ApiResponse<String>> getTechnicalSupport(
            @Valid @RequestBody ChatMessageRequest request) {
        
        logger.info("Received technical support request");

        try {
            return aiService.getTechnicalSupport(request.getMessage())
                    .map(response -> ResponseEntity.ok(ApiResponse.success("Technical support provided", response)))
                    .block();
        } catch (Exception e) {
            logger.error("Error providing technical support: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to provide technical support. Please try again."));
        }
    }

    /**
     * POST /api/chat/custom - Send message with custom system prompt
     */
    @PostMapping("/custom")
    public ResponseEntity<ApiResponse<ChatMessage.ChatResponse>> sendCustomMessage(
            @Valid @RequestBody CustomChatRequest request) {
        
        logger.info("Received custom chat message request");

        try {
            return aiService.sendMessageWithSystemPrompt(request.getMessage(), request.getSystemPrompt())
                    .map(response -> ResponseEntity.ok(ApiResponse.success("Custom message processed successfully", response)))
                    .block();
        } catch (Exception e) {
            logger.error("Error processing custom chat message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process custom message. Please try again."));
        }
    }

    /**
     * GET /api/chat/rate-limit - Get current rate limit status
     */
    @GetMapping("/rate-limit")
    public ResponseEntity<ApiResponse<AIService.RateLimitStatus>> getRateLimitStatus() {
        logger.debug("Rate limit status requested");

        try {
            AIService.RateLimitStatus status = aiService.getRateLimitStatus();
            return ResponseEntity.ok(ApiResponse.success("Rate limit status retrieved", status));
        } catch (Exception e) {
            logger.error("Error getting rate limit status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to get rate limit status"));
        }
    }

    /**
     * POST /api/chat/health - Health check for OpenAI service
     */
    @PostMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        logger.debug("Chat service health check requested");

        try {
            // Try to send a simple test message
            String testResponse = aiService.sendMessageAndGetResponse("Hello")
                    .block();
            
            Map<String, Object> healthStatus = Map.of(
                "status", "healthy",
                "openai_connected", testResponse != null && !testResponse.contains("trouble"),
                "rate_limit_status", aiService.getRateLimitStatus()
            );
            
            return ResponseEntity.ok(ApiResponse.success("Chat service is healthy", healthStatus));
        } catch (Exception e) {
            logger.error("Chat service health check failed: {}", e.getMessage(), e);
            
            Map<String, Object> healthStatus = Map.of(
                "status", "unhealthy",
                "error", e.getMessage(),
                "rate_limit_status", aiService.getRateLimitStatus()
            );
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.error("Chat service is unhealthy"));
        }
    }

    /**
     * Request DTO for chat messages
     */
    public static class ChatMessageRequest {
        @NotBlank(message = "Message cannot be empty")
        @Size(min = 1, max = 2000, message = "Message must be between 1 and 2000 characters")
        private String message;

        public ChatMessageRequest() {}

        public ChatMessageRequest(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    /**
     * Request DTO for custom chat messages with system prompt
     */
    public static class CustomChatRequest {
        @NotBlank(message = "Message cannot be empty")
        @Size(min = 1, max = 2000, message = "Message must be between 1 and 2000 characters")
        private String message;

        @NotBlank(message = "System prompt cannot be empty")
        @Size(min = 1, max = 1000, message = "System prompt must be between 1 and 1000 characters")
        private String systemPrompt;

        public CustomChatRequest() {}

        public CustomChatRequest(String message, String systemPrompt) {
            this.message = message;
            this.systemPrompt = systemPrompt;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getSystemPrompt() { return systemPrompt; }
        public void setSystemPrompt(String systemPrompt) { this.systemPrompt = systemPrompt; }
    }
} 