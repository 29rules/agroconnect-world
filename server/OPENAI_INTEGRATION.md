# OpenAI Integration for AgroConnect World

This document provides comprehensive information about the OpenAI API integration in the AgroConnect World application.

## 🚀 Overview

The OpenAI integration provides intelligent chat capabilities for the AgroConnect World platform, enabling users to get agricultural advice, technical support, and general assistance through AI-powered conversations.

## 🛠 Features

- **General Chat**: Basic conversation capabilities
- **Agricultural Advice**: Specialized farming and agriculture guidance
- **Technical Support**: Platform-specific help and troubleshooting
- **Custom Prompts**: Flexible system prompt configuration
- **Rate Limiting**: Built-in request throttling (60 requests/minute)
- **Error Handling**: Comprehensive error management and fallbacks
- **Health Monitoring**: Service health checks and status monitoring

## 📋 Prerequisites

- OpenAI API key (get from [OpenAI Platform](https://platform.openai.com/))
- Java 17+
- Spring Boot 3.2.0+
- WebFlux for reactive HTTP client

## ⚙️ Configuration

### Environment Variables

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

### Application Properties

Configure OpenAI settings in `application.yml`:

```yaml
openai:
  api:
    key: ${OPENAI_API_KEY:}  # Set via environment variable
  model: gpt-3.5-turbo      # Default model
  max-tokens: 1000          # Maximum response length
  temperature: 0.7          # Response creativity (0.0-1.0)
```

## 📚 API Endpoints

### 1. General Chat Message

**POST** `/api/chat/message`

Send a general message and receive a full OpenAI response.

**Request:**
```json
{
  "message": "How can I improve my crop yield?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message processed successfully",
  "data": {
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1677652288,
    "model": "gpt-3.5-turbo",
    "choices": [
      {
        "index": 0,
        "message": {
          "role": "assistant",
          "content": "To improve your crop yield, consider these key factors..."
        },
        "finish_reason": "stop"
      }
    ],
    "usage": {
      "prompt_tokens": 9,
      "completion_tokens": 12,
      "total_tokens": 21
    }
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### 2. Simple Chat Response

**POST** `/api/chat/simple`

Send a message and receive just the response text.

**Request:**
```json
{
  "message": "What is sustainable farming?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message processed successfully",
  "data": "Sustainable farming is an agricultural approach that focuses on..."
}
```

### 3. Agricultural Advice

**POST** `/api/chat/agricultural-advice`

Get specialized agricultural advice with farming-specific prompts.

**Request:**
```json
{
  "message": "How should I prepare my soil for spring planting?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agricultural advice provided",
  "data": "For spring planting, start by testing your soil pH and nutrient levels..."
}
```

### 4. Technical Support

**POST** `/api/chat/technical-support`

Get platform-specific technical support.

**Request:**
```json
{
  "message": "How do I access the analytics dashboard?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Technical support provided",
  "data": "To access the analytics dashboard, log into your AgroConnect account..."
}
```

### 5. Custom Chat

**POST** `/api/chat/custom`

Send a message with a custom system prompt.

**Request:**
```json
{
  "message": "Tell me about crop rotation",
  "systemPrompt": "You are an expert in crop rotation and soil health."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Custom message processed successfully",
  "data": {
    "id": "chatcmpl-123",
    "choices": [...],
    "usage": {...}
  }
}
```

### 6. Rate Limit Status

**GET** `/api/chat/rate-limit`

Check current rate limit status.

**Response:**
```json
{
  "success": true,
  "message": "Rate limit status retrieved",
  "data": {
    "currentRequests": 15,
    "maxRequests": 60,
    "timeUntilReset": 45000,
    "limitExceeded": false
  }
}
```

### 7. Health Check

**POST** `/api/chat/health`

Check the health of the OpenAI service.

**Response:**
```json
{
  "success": true,
  "message": "Chat service is healthy",
  "data": {
    "status": "healthy",
    "openai_connected": true,
    "rate_limit_status": {
      "currentRequests": 5,
      "maxRequests": 60,
      "timeUntilReset": 55000
    }
  }
}
```

## 🔧 Usage Examples

### Java Service Usage

```java
@Service
public class MyService {
    
    @Autowired
    private OpenAIService openAIService;
    
    public void exampleUsage() {
        // Send a simple message
        openAIService.sendMessageAndGetResponse("Hello")
            .subscribe(response -> System.out.println("Response: " + response));
        
        // Get agricultural advice
        openAIService.getAgriculturalAdvice("How to grow tomatoes?")
            .subscribe(advice -> System.out.println("Advice: " + advice));
        
        // Check rate limit
        OpenAIService.RateLimitStatus status = openAIService.getRateLimitStatus();
        System.out.println("Requests used: " + status.getCurrentRequests());
    }
}
```

### cURL Examples

```bash
# Send a simple message
curl -X POST http://localhost:8080/api/chat/simple \
  -H "Content-Type: application/json" \
  -d '{"message": "What is organic farming?"}'

# Get agricultural advice
curl -X POST http://localhost:8080/api/chat/agricultural-advice \
  -H "Content-Type: application/json" \
  -d '{"message": "How to improve soil fertility?"}'

# Check rate limit
curl http://localhost:8080/api/chat/rate-limit

# Health check
curl -X POST http://localhost:8080/api/chat/health
```

## 🛡️ Security & Rate Limiting

### Rate Limiting

- **Limit**: 60 requests per minute
- **Reset**: Every minute
- **Monitoring**: Real-time status tracking
- **Handling**: Graceful error responses when limit exceeded

### Error Handling

The service includes comprehensive error handling:

- **API Errors**: Proper handling of OpenAI API errors
- **Network Issues**: Retry logic with exponential backoff
- **Rate Limits**: Clear error messages when limits exceeded
- **Timeouts**: 30-second request timeout
- **Fallbacks**: Graceful degradation with helpful error messages

### Security Considerations

- **API Key**: Stored as environment variable, never in code
- **Input Validation**: All user inputs validated and sanitized
- **CORS**: Properly configured for frontend integration
- **Logging**: Sensitive data not logged

## 🔍 Monitoring & Logging

### Logging Levels

```yaml
logging:
  level:
    com.agroconnect.service.OpenAIService: DEBUG
```

### Key Metrics

- Request count and rate limiting status
- Response times and success rates
- Error rates and types
- Token usage statistics

### Health Monitoring

The health check endpoint provides:
- Service connectivity status
- Rate limit information
- Error state detection

## 🧪 Testing

### Unit Tests

Run the test suite:

```bash
mvn test -Dtest=OpenAIServiceTest
```

### Integration Tests

Test with real API (requires valid API key):

```bash
# Set API key
export OPENAI_API_KEY="your-key"

# Run tests
mvn test -Dtest=ChatControllerTest
```

## 🚀 Deployment

### Environment Setup

1. **Set API Key**:
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   ```

2. **Configure Application**:
   ```yaml
   openai:
     api:
       key: ${OPENAI_API_KEY}
     model: gpt-3.5-turbo
     max-tokens: 1000
     temperature: 0.7
   ```

3. **Start Application**:
   ```bash
   mvn spring-boot:run
   ```

### Docker Deployment

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/agroconnect-world-api-1.0.0.jar app.jar
ENV OPENAI_API_KEY=your-api-key
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🔧 Troubleshooting

### Common Issues

1. **API Key Not Set**:
   ```
   Error: OpenAI API key not configured
   Solution: Set OPENAI_API_KEY environment variable
   ```

2. **Rate Limit Exceeded**:
   ```
   Error: Rate limit exceeded. Please try again later.
   Solution: Wait for rate limit reset or implement caching
   ```

3. **Network Timeout**:
   ```
   Error: Request timeout
   Solution: Check network connectivity and OpenAI API status
   ```

4. **Invalid Model**:
   ```
   Error: Model not found
   Solution: Verify model name in configuration
   ```

### Debug Mode

Enable debug logging:

```yaml
logging:
  level:
    com.agroconnect.service.OpenAIService: DEBUG
    org.springframework.web.reactive.function.client: DEBUG
```

## 📈 Performance Optimization

### Best Practices

1. **Caching**: Implement response caching for common queries
2. **Connection Pooling**: WebClient handles connection pooling automatically
3. **Async Processing**: All operations are non-blocking
4. **Rate Limiting**: Built-in rate limiting prevents API abuse

### Monitoring

Monitor these key metrics:
- Response times
- Success rates
- Token usage
- Rate limit utilization

## 🔮 Future Enhancements

### Planned Features

1. **Conversation History**: Maintain chat context across messages
2. **Streaming Responses**: Real-time response streaming
3. **Multi-language Support**: Internationalization
4. **Advanced Caching**: Redis-based response caching
5. **Analytics Dashboard**: Usage analytics and insights

### Integration Opportunities

1. **Contact Form Enhancement**: AI-powered form assistance
2. **Knowledge Base**: Automated FAQ responses
3. **Market Analysis**: Agricultural market insights
4. **Crop Recommendations**: AI-driven crop suggestions

---

**Note**: This integration requires a valid OpenAI API key and internet connectivity to function properly. Ensure proper security measures are in place when deploying to production environments. 