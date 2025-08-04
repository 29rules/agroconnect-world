package com.agroconnect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * DTOs for OpenAI Chat API integration
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
public class ChatMessage {

    /**
     * Request DTO for OpenAI Chat API
     */
    public static class ChatRequest {
        private String model = "gpt-3.5-turbo";
        private List<Message> messages;
        private double temperature = 0.7;
        private int maxTokens = 1000;

        public ChatRequest() {}

        public ChatRequest(String userMessage) {
            this.messages = List.of(
                new Message("system", "You are an agricultural expert assistant for AgroConnect World. Provide helpful, accurate, and friendly advice about farming, agricultural technology, and sustainable practices. Keep responses concise and practical."),
                new Message("user", userMessage)
            );
        }

        // Getters and Setters
        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }

        public List<Message> getMessages() { return messages; }
        public void setMessages(List<Message> messages) { this.messages = messages; }

        public double getTemperature() { return temperature; }
        public void setTemperature(double temperature) { this.temperature = temperature; }

        public int getMaxTokens() { return maxTokens; }
        public void setMaxTokens(int maxTokens) { this.maxTokens = maxTokens; }
    }

    /**
     * Response DTO for OpenAI Chat API
     */
    public static class ChatResponse {
        private String id;
        private String object;
        private long created;
        private String model;
        private List<Choice> choices;
        private Usage usage;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getObject() { return object; }
        public void setObject(String object) { this.object = object; }

        public long getCreated() { return created; }
        public void setCreated(long created) { this.created = created; }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }

        public List<Choice> getChoices() { return choices; }
        public void setChoices(List<Choice> choices) { this.choices = choices; }

        public Usage getUsage() { return usage; }
        public void setUsage(Usage usage) { this.usage = usage; }

        /**
         * Get the first response message
         */
        public String getFirstResponse() {
            if (choices != null && !choices.isEmpty() && choices.get(0).getMessage() != null) {
                return choices.get(0).getMessage().getContent();
            }
            return "Sorry, I couldn't generate a response at this time.";
        }
    }

    /**
     * Message DTO for chat messages
     */
    public static class Message {
        private String role;
        private String content;

        public Message() {}

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }

        // Getters and Setters
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    /**
     * Choice DTO for response choices
     */
    public static class Choice {
        private int index;
        private Message message;
        @JsonProperty("finish_reason")
        private String finishReason;

        // Getters and Setters
        public int getIndex() { return index; }
        public void setIndex(int index) { this.index = index; }

        public Message getMessage() { return message; }
        public void setMessage(Message message) { this.message = message; }

        public String getFinishReason() { return finishReason; }
        public void setFinishReason(String finishReason) { this.finishReason = finishReason; }
    }

    /**
     * Usage DTO for token usage information
     */
    public static class Usage {
        @JsonProperty("prompt_tokens")
        private int promptTokens;
        @JsonProperty("completion_tokens")
        private int completionTokens;
        @JsonProperty("total_tokens")
        private int totalTokens;

        // Getters and Setters
        public int getPromptTokens() { return promptTokens; }
        public void setPromptTokens(int promptTokens) { this.promptTokens = promptTokens; }

        public int getCompletionTokens() { return completionTokens; }
        public void setCompletionTokens(int completionTokens) { this.completionTokens = completionTokens; }

        public int getTotalTokens() { return totalTokens; }
        public void setTotalTokens(int totalTokens) { this.totalTokens = totalTokens; }
    }

    /**
     * Error DTO for OpenAI API errors
     */
    public static class ChatError {
        private Error error;

        public Error getError() { return error; }
        public void setError(Error error) { this.error = error; }

        public static class Error {
            private String message;
            private String type;
            private String code;

            public String getMessage() { return message; }
            public void setMessage(String message) { this.message = message; }

            public String getType() { return type; }
            public void setType(String type) { this.type = type; }

            public String getCode() { return code; }
            public void setCode(String code) { this.code = code; }
        }
    }
} 