package com.agroconnect;

import com.agroconnect.ai.AIService;
import com.agroconnect.dto.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OpenAIServiceTest {

    private ObjectMapper objectMapper;

    @InjectMocks
    private AIService aiService;

    @BeforeEach
    void setUp() {
        // Create a real ObjectMapper instance
        objectMapper = new ObjectMapper();
        ReflectionTestUtils.setField(aiService, "objectMapper", objectMapper);
        
        // Set required fields using reflection
        ReflectionTestUtils.setField(aiService, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(aiService, "model", "gpt-3.5-turbo");
        ReflectionTestUtils.setField(aiService, "maxTokens", 1000);
        ReflectionTestUtils.setField(aiService, "temperature", 0.7);
    }

    @Test
    void testSendMessageWithValidInput() {
        // Given
        String userMessage = "Hello, how can you help me with farming?";

        // When & Then
        StepVerifier.create(aiService.sendMessage(userMessage))
                .expectError() // Will fail because we don't have a real API key
                .verify();
    }

    @Test
    void testSendMessageWithNullInput() {
        // When & Then
        StepVerifier.create(aiService.sendMessage(null))
                .expectError(IllegalArgumentException.class)
                .verify();
    }

    @Test
    void testSendMessageWithEmptyInput() {
        // When & Then
        StepVerifier.create(aiService.sendMessage(""))
                .expectError(IllegalArgumentException.class)
                .verify();
    }

    @Test
    void testSendMessageWithWhitespaceInput() {
        // When & Then
        StepVerifier.create(aiService.sendMessage("   "))
                .expectError(IllegalArgumentException.class)
                .verify();
    }

    @Test
    void testSendMessageAndGetResponse() {
        // Given
        String userMessage = "What is sustainable farming?";

        // When & Then
        StepVerifier.create(aiService.sendMessageAndGetResponse(userMessage))
                .expectNext("I apologize, but I'm having trouble processing your request right now. Please try again later.")
                .verifyComplete();
    }

    @Test
    void testGetAgriculturalAdvice() {
        // Given
        String userQuestion = "How can I improve my crop yield?";

        // When & Then
        StepVerifier.create(aiService.getAgriculturalAdvice(userQuestion))
                .expectNext("I apologize, but I'm having trouble providing agricultural advice right now. Please try again later or contact our support team.")
                .verifyComplete();
    }

    @Test
    void testGetTechnicalSupport() {
        // Given
        String userQuestion = "How do I use the analytics dashboard?";

        // When & Then
        StepVerifier.create(aiService.getTechnicalSupport(userQuestion))
                .expectNext("I apologize, but I'm having trouble providing technical support right now. Please contact our support team directly.")
                .verifyComplete();
    }

    @Test
    void testSendMessageWithCustomSystemPrompt() {
        // Given
        String userMessage = "Tell me about organic farming";
        String systemPrompt = "You are an organic farming expert.";

        // When & Then
        StepVerifier.create(aiService.sendMessageWithSystemPrompt(userMessage, systemPrompt))
                .expectError() // Will fail because we don't have a real API key
                .verify();
    }

    @Test
    void testSendMessageWithCustomSystemPromptNullMessage() {
        // Given
        String systemPrompt = "You are an expert.";

        // When & Then
        StepVerifier.create(aiService.sendMessageWithSystemPrompt(null, systemPrompt))
                .expectError(IllegalArgumentException.class)
                .verify();
    }

    @Test
    void testSendMessageWithCustomSystemPromptEmptyMessage() {
        // Given
        String systemPrompt = "You are an expert.";

        // When & Then
        StepVerifier.create(aiService.sendMessageWithSystemPrompt("", systemPrompt))
                .expectError(IllegalArgumentException.class)
                .verify();
    }

    @Test
    void testGetRateLimitStatus() {
        // When
        AIService.RateLimitStatus status = aiService.getRateLimitStatus();

        // Then
        assertNotNull(status);
        assertTrue(status.getCurrentRequests() >= 0);
        assertEquals(60, status.getMaxRequests());
        assertTrue(status.getTimeUntilReset() >= 0);
    }

    @Test
    void testUpdateApiKey() {
        // Given
        String newApiKey = "new-test-api-key";

        // When
        aiService.updateApiKey(newApiKey);

        // Then
        // The method should execute without throwing an exception
        assertDoesNotThrow(() -> aiService.updateApiKey(newApiKey));
    }

    @Test
    void testChatRequestCreation() {
        // Given
        String userMessage = "Test message";

        // When
        ChatMessage.ChatRequest request = new ChatMessage.ChatRequest(userMessage);

        // Then
        assertNotNull(request);
        assertEquals("gpt-3.5-turbo", request.getModel());
        assertEquals(0.7, request.getTemperature());
        assertEquals(1000, request.getMaxTokens());
        assertNotNull(request.getMessages());
        assertEquals(2, request.getMessages().size());
        assertEquals("system", request.getMessages().get(0).getRole());
        assertEquals("user", request.getMessages().get(1).getRole());
        assertEquals(userMessage, request.getMessages().get(1).getContent());
    }

    @Test
    void testChatResponseFirstResponse() {
        // Given
        ChatMessage.ChatResponse response = new ChatMessage.ChatResponse();
        ChatMessage.Choice choice = new ChatMessage.Choice();
        ChatMessage.Message message = new ChatMessage.Message();
        message.setContent("Test response");
        choice.setMessage(message);
        response.setChoices(java.util.List.of(choice));

        // When
        String firstResponse = response.getFirstResponse();

        // Then
        assertEquals("Test response", firstResponse);
    }

    @Test
    void testChatResponseFirstResponseWithNullChoices() {
        // Given
        ChatMessage.ChatResponse response = new ChatMessage.ChatResponse();
        response.setChoices(null);

        // When
        String firstResponse = response.getFirstResponse();

        // Then
        assertEquals("Sorry, I couldn't generate a response at this time.", firstResponse);
    }

    @Test
    void testChatResponseFirstResponseWithEmptyChoices() {
        // Given
        ChatMessage.ChatResponse response = new ChatMessage.ChatResponse();
        response.setChoices(java.util.List.of());

        // When
        String firstResponse = response.getFirstResponse();

        // Then
        assertEquals("Sorry, I couldn't generate a response at this time.", firstResponse);
    }

    @Test
    void testChatResponseFirstResponseWithNullMessage() {
        // Given
        ChatMessage.ChatResponse response = new ChatMessage.ChatResponse();
        ChatMessage.Choice choice = new ChatMessage.Choice();
        choice.setMessage(null);
        response.setChoices(java.util.List.of(choice));

        // When
        String firstResponse = response.getFirstResponse();

        // Then
        assertEquals("Sorry, I couldn't generate a response at this time.", firstResponse);
    }

    @Test
    void testRateLimitStatusMethods() {
        // Given
        AIService.RateLimitStatus status = new AIService.RateLimitStatus(30, 60, 30000);

        // When & Then
        assertEquals(30, status.getCurrentRequests());
        assertEquals(60, status.getMaxRequests());
        assertEquals(30000, status.getTimeUntilReset());
        assertFalse(status.isLimitExceeded());

        // Test with exceeded limit
        AIService.RateLimitStatus exceededStatus = new AIService.RateLimitStatus(60, 60, 0);
        assertTrue(exceededStatus.isLimitExceeded());
    }
} 