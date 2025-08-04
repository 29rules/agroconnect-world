# AgroConnect World - Spring Boot REST API

A comprehensive REST API for AgroConnect World built with Spring Boot, MongoDB, and modern Java practices.

## 🚀 Features

- **Contact Form Management**: Complete CRUD operations for contact submissions
- **MongoDB Integration**: NoSQL database with Spring Data MongoDB
- **Input Validation**: Comprehensive validation with Bean Validation
- **CORS Support**: Cross-origin resource sharing configuration
- **Error Handling**: Global exception handling with consistent responses
- **Security**: Spring Security with CORS and basic protection
- **Logging**: Comprehensive logging with SLF4J
- **Documentation**: OpenAPI/Swagger ready
- **Testing**: Unit and integration test support

## 🛠 Technology Stack

- **Java 17**: Latest LTS version
- **Spring Boot 3.2.0**: Latest stable version
- **Spring Data MongoDB**: MongoDB integration
- **Spring Security**: Security framework
- **Spring Validation**: Input validation
- **MongoDB**: NoSQL database
- **Maven**: Build tool
- **SLF4J**: Logging framework

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB 4.4+ (local or cloud instance)
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd server
mvn clean install
```

### 2. Configure MongoDB

Ensure MongoDB is running on `localhost:27017` or update the configuration in `application.yml`.

### 3. Run the Application

```bash
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080/api`

## 📚 API Endpoints

### Contact Form Endpoints

#### POST `/api/contact`
Submit a new contact form.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "subject": "General Inquiry",
  "message": "I'm interested in learning more about your services.",
  "company": "Farm Corp",
  "farmType": "Organic",
  "farmSize": "100 acres",
  "location": "Kansas, USA",
  "preferredContactMethod": "email",
  "newsletterSubscription": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "subject": "General Inquiry",
    "message": "I'm interested in learning more about your services.",
    "status": "NEW",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

#### GET `/api/contact`
Get all contacts with pagination.

**Query Parameters:**
- `page` (default: 0): Page number
- `size` (default: 10): Page size
- `sortBy` (default: createdAt): Sort field
- `sortDir` (default: desc): Sort direction

**Example:** `GET /api/contact?page=0&size=20&sortBy=email&sortDir=asc`

#### GET `/api/contact/{id}`
Get contact by ID.

#### GET `/api/contact/status/{status}`
Get contacts by status (NEW, PROCESSED, etc.).

#### GET `/api/contact/search?q={searchTerm}`
Search contacts by name, email, or subject.

#### PUT `/api/contact/{id}/status?status={newStatus}`
Update contact status.

#### DELETE `/api/contact/{id}`
Delete contact by ID.

#### GET `/api/contact/statistics`
Get contact statistics.

#### GET `/api/contact/today`
Get contacts created today.

#### GET `/api/contact/email/{email}`
Get contacts by email address.

#### GET `/api/contact/farm-type/{farmType}`
Get contacts by farm type.

#### GET `/api/contact/location/{location}`
Get contacts by location.

## 🔧 Configuration

### Application Properties

Key configuration options in `application.yml`:

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  data:
    mongodb:
      host: localhost
      port: 27017
      database: agroconnect_world
      auto-index-creation: true

cors:
  allowed-origins: 
    - "http://localhost:3000"
    - "https://agroconnect-world.com"
```

### Environment Variables

You can override configuration using environment variables:

```bash
export SPRING_DATA_MONGODB_HOST=your-mongodb-host
export SPRING_DATA_MONGODB_PORT=27017
export SPRING_DATA_MONGODB_DATABASE=agroconnect_world
export SERVER_PORT=8080
```

## 📊 Data Model

### Contact Entity

```java
@Document(collection = "contacts")
public class Contact {
    @Id
    private String id;
    
    @NotBlank
    @Size(min = 2, max = 50)
    private String firstName;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\)]{10,15}$")
    private String phone;
    
    @NotBlank
    @Size(min = 5, max = 200)
    private String subject;
    
    @NotBlank
    @Size(min = 10, max = 2000)
    private String message;
    
    // Optional fields
    private String company;
    private String farmType;
    private String farmSize;
    private String location;
    private String preferredContactMethod;
    private boolean newsletterSubscription;
    
    // System fields
    private String status;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

## 🔒 Security

### CORS Configuration

The API is configured to allow requests from:
- `http://localhost:3000` (React development)
- `http://localhost:3001` (Alternative React port)
- `https://agroconnect-world.com` (Production)

### Authentication

Currently configured for public access to contact endpoints. For production, consider adding:
- JWT authentication
- API key authentication
- Rate limiting
- Request validation

## 🧪 Testing

### Run Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ContactControllerTest

# Run with coverage
mvn test jacoco:report
```

### Test Endpoints

```bash
# Test contact submission
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1-555-123-4567",
    "subject": "Test Subject",
    "message": "This is a test message."
  }'

# Test getting all contacts
curl http://localhost:8080/api/contact

# Test getting statistics
curl http://localhost:8080/api/contact/statistics
```

## 📈 Monitoring

### Health Check

```bash
curl http://localhost:8080/api/actuator/health
```

### Metrics

```bash
curl http://localhost:8080/api/actuator/metrics
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/agroconnect-world-api-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Build and Run

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/agroconnect-world-api-1.0.0.jar

# Run with custom profile
java -jar target/agroconnect-world-api-1.0.0.jar --spring.profiles.active=production
```

### Environment-Specific Configuration

Create profile-specific configuration files:

- `application-dev.yml` - Development environment
- `application-prod.yml` - Production environment
- `application-test.yml` - Testing environment

## 🔧 Development

### Project Structure

```
src/
├── main/
│   ├── java/com/agroconnect/
│   │   ├── AgroConnectWorldApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   └── ContactController.java
│   │   ├── dto/
│   │   │   ├── ApiResponse.java
│   │   │   └── ContactRequest.java
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── model/
│   │   │   └── Contact.java
│   │   ├── repository/
│   │   │   └── ContactRepository.java
│   │   └── service/
│   │       └── ContactService.java
│   └── resources/
│       └── application.yml
└── test/
    └── java/com/agroconnect/
        └── [test classes]
```

### Adding New Features

1. **Create Model**: Add new entity in `model` package
2. **Create Repository**: Add repository interface in `repository` package
3. **Create Service**: Add business logic in `service` package
4. **Create Controller**: Add REST endpoints in `controller` package
5. **Add Tests**: Create unit and integration tests
6. **Update Documentation**: Update this README

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**AgroConnect World API** - Built with ❤️ using Spring Boot and MongoDB 