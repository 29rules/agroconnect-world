package com.agroconnect.ai;

import com.agroconnect.dto.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service for OpenAI API integration
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);
    
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final int MAX_RETRIES = 3;
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(30);
    private static final int RATE_LIMIT_PER_MINUTE = 60;
    
    private WebClient webClient;
    private final ObjectMapper objectMapper;
    
    @Value("${openai.api.key:}")
    private String apiKey;
    
    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;
    
    @Value("${openai.max-tokens:1000}")
    private int maxTokens;
    
    @Value("${openai.temperature:0.7}")
    private double temperature;
    
    // Rate limiting
    private final AtomicInteger requestCount = new AtomicInteger(0);
    private final AtomicLong lastResetTime = new AtomicLong(System.currentTimeMillis());
    
    @Autowired
    public AIService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder()
                .baseUrl(OPENAI_API_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }
    
    /**
     * Send a message to OpenAI and get a response
     */
    public Mono<ChatMessage.ChatResponse> sendMessage(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("User message cannot be null or empty"));
        }
        
        if (!isRateLimitAllowed()) {
            return Mono.error(new RuntimeException("Rate limit exceeded. Please try again later."));
        }
        
        ChatMessage.ChatRequest request = new ChatMessage.ChatRequest(userMessage);
        request.setModel(model);
        request.setMaxTokens(maxTokens);
        request.setTemperature(temperature);
        
        logger.info("Sending message to OpenAI: {}", userMessage.substring(0, Math.min(userMessage.length(), 100)) + "...");
        
        return webClient.post()
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ChatMessage.ChatResponse.class)
                .timeout(REQUEST_TIMEOUT)
                .retryWhen(reactor.util.retry.Retry.fixedDelay(MAX_RETRIES, Duration.ofSeconds(1))
                        .filter(throwable -> !(throwable instanceof WebClientResponseException.BadRequest)))
                .doOnSuccess(response -> {
                    incrementRequestCount();
                    logger.info("OpenAI response received successfully");
                })
                .doOnError(error -> {
                    logger.error("Error calling OpenAI API: {}", error.getMessage());
                    if (error instanceof WebClientResponseException) {
                        WebClientResponseException wcre = (WebClientResponseException) error;
                        logger.error("HTTP Status: {}, Response Body: {}", wcre.getStatusCode(), wcre.getResponseBodyAsString());
                    }
                });
    }
    
    /**
     * Send a message and return just the response text
     */
    public Mono<String> sendMessageAndGetResponse(String userMessage) {
        return sendMessage(userMessage)
                .map(ChatMessage.ChatResponse::getFirstResponse)
                .onErrorReturn("I apologize, but I'm having trouble processing your request right now. Please try again later.");
    }
    
    /**
     * Send a message with custom system prompt
     */
    public Mono<ChatMessage.ChatResponse> sendMessageWithSystemPrompt(String userMessage, String systemPrompt) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("User message cannot be null or empty"));
        }
        
        if (!isRateLimitAllowed()) {
            return Mono.error(new RuntimeException("Rate limit exceeded. Please try again later."));
        }
        
        ChatMessage.ChatRequest request = new ChatMessage.ChatRequest();
        request.setModel(model);
        request.setMaxTokens(maxTokens);
        request.setTemperature(temperature);
        request.setMessages(java.util.List.of(
                new ChatMessage.Message("system", systemPrompt),
                new ChatMessage.Message("user", userMessage)
        ));
        
        logger.info("Sending message with custom system prompt to OpenAI");
        
        return webClient.post()
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ChatMessage.ChatResponse.class)
                .timeout(REQUEST_TIMEOUT)
                .retryWhen(reactor.util.retry.Retry.fixedDelay(MAX_RETRIES, Duration.ofSeconds(1))
                        .filter(throwable -> !(throwable instanceof WebClientResponseException.BadRequest)))
                .doOnSuccess(response -> {
                    incrementRequestCount();
                    logger.info("OpenAI response received successfully with custom prompt");
                })
                .doOnError(error -> {
                    logger.error("Error calling OpenAI API with custom prompt: {}", error.getMessage());
                });
    }
    
    /**
     * Get agricultural advice using specialized prompt
     */
    public Mono<String> getAgriculturalAdvice(String userQuestion) {
        String agriculturalSystemPrompt = """
            You are an expert agricultural consultant for AgroConnect World. 
            Provide practical, science-based advice on farming, crop management, 
            sustainable agriculture, and agricultural technology. 
            Focus on actionable recommendations and best practices. 
            Keep responses concise (under 200 words) and easy to understand.
            If you don't know something specific, suggest consulting with local agricultural experts.
            """;
        
        return sendMessageWithSystemPrompt(userQuestion, agriculturalSystemPrompt)
                .map(ChatMessage.ChatResponse::getFirstResponse)
                .onErrorReturn("I apologize, but I'm having trouble providing agricultural advice right now. Please try again later or contact our support team.");
    }
    
    /**
     * Get technical support using specialized prompt
     */
    public Mono<String> getTechnicalSupport(String userQuestion) {
        String technicalSystemPrompt = """
            You are a technical support specialist for AgroConnect World's agricultural technology platform.
            Help users with questions about our smart analytics, community features, and marketplace tools.
            Provide clear, step-by-step guidance when possible.
            If the issue requires human intervention, suggest contacting our support team.
            Keep responses helpful and professional.
            """;
        
        return sendMessageWithSystemPrompt(userQuestion, technicalSystemPrompt)
                .map(ChatMessage.ChatResponse::getFirstResponse)
                .onErrorReturn("I apologize, but I'm having trouble providing technical support right now. Please contact our support team directly.");
    }
    
    /**
     * Check if rate limit allows another request
     */
    private boolean isRateLimitAllowed() {
        long currentTime = System.currentTimeMillis();
        long lastReset = lastResetTime.get();
        
        // Reset counter if a minute has passed
        if (currentTime - lastReset > 60000) {
            requestCount.set(0);
            lastResetTime.set(currentTime);
        }
        
        return requestCount.get() < RATE_LIMIT_PER_MINUTE;
    }
    
    /**
     * Increment request count
     */
    private void incrementRequestCount() {
        requestCount.incrementAndGet();
    }
    
    /**
     * Get current rate limit status
     */
    public RateLimitStatus getRateLimitStatus() {
        long currentTime = System.currentTimeMillis();
        long lastReset = lastResetTime.get();
        long timeUntilReset = Math.max(0, 60000 - (currentTime - lastReset));
        
        return new RateLimitStatus(
                requestCount.get(),
                RATE_LIMIT_PER_MINUTE,
                timeUntilReset
        );
    }
    
    /**
     * Rate limit status DTO
     */
    public static class RateLimitStatus {
        private final int currentRequests;
        private final int maxRequests;
        private final long timeUntilReset;
        
        public RateLimitStatus(int currentRequests, int maxRequests, long timeUntilReset) {
            this.currentRequests = currentRequests;
            this.maxRequests = maxRequests;
            this.timeUntilReset = timeUntilReset;
        }
        
        public int getCurrentRequests() { return currentRequests; }
        public int getMaxRequests() { return maxRequests; }
        public long getTimeUntilReset() { return timeUntilReset; }
        public boolean isLimitExceeded() { return currentRequests >= maxRequests; }
    }
    
    /**
     * Update API key (useful for dynamic configuration)
     */
    public void updateApiKey(String newApiKey) {
        this.apiKey = newApiKey;
        // Recreate WebClient with new API key
        this.webClient = WebClient.builder()
                .baseUrl(OPENAI_API_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + newApiKey)
                .build();
        logger.info("OpenAI API key updated");
    }
} 