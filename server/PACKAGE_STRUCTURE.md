# AgroConnect World - Backend Package Structure

This document outlines the organized package structure for the AgroConnect World backend application.

## 📁 Package Organization

```
backend/
└── src/main/java/com/agroconnect/
    ├── contact/    → ContactService
    ├── products/   → ProductService
    ├── analytics/  → AnalyticsService
    ├── ai/         → AIService (OpenAI)
    ├── controller/ → REST Controllers
    ├── dto/        → Data Transfer Objects
    ├── model/      → Entity Models
    ├── repository/ → Data Access Layer
    ├── config/     → Configuration Classes
    └── exception/  → Exception Handlers
```

## 🏗️ Package Details

### 1. **contact/** - Contact Management
**Purpose**: Handle contact form submissions and management

**Components**:
- `ContactService.java` - Business logic for contact operations

**Key Features**:
- Contact form submission processing
- Contact status management
- Search and filtering capabilities
- Statistics and reporting
- Email validation and duplicate checking

**API Endpoints**:
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (paginated)
- `GET /api/contact/{id}` - Get contact by ID
- `GET /api/contact/statistics` - Get contact statistics
- `GET /api/contact/search?q={term}` - Search contacts
- `PUT /api/contact/{id}/status` - Update contact status

### 2. **products/** - Product Management
**Purpose**: Handle product catalog and marketplace functionality

**Components**:
- `ProductService.java` - Business logic for product operations

**Key Features**:
- Product catalog management
- Category-based filtering
- Search functionality
- Featured products
- Price range filtering
- Product statistics

**API Endpoints**:
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?q={term}` - Search products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/statistics` - Get product statistics

### 3. **analytics/** - Analytics & Reporting
**Purpose**: Provide comprehensive analytics and reporting capabilities

**Components**:
- `AnalyticsService.java` - Business logic for analytics operations

**Key Features**:
- Dashboard analytics
- Contact distribution analysis
- Farm type analytics
- Location-based insights
- Conversion rate tracking
- Performance metrics
- Daily trends analysis

**API Endpoints**:
- `GET /api/analytics/dashboard` - Get comprehensive dashboard analytics
- `GET /api/analytics/farm-type-distribution` - Get farm type distribution
- `GET /api/analytics/location-distribution` - Get location distribution
- `GET /api/analytics/conversion` - Get conversion analytics
- `GET /api/analytics/performance` - Get performance metrics
- `GET /api/analytics/daily-trends` - Get daily contact trends

### 4. **ai/** - Artificial Intelligence Integration
**Purpose**: Handle OpenAI integration and AI-powered features

**Components**:
- `AIService.java` - Business logic for AI operations (renamed from OpenAIService)

**Key Features**:
- OpenAI API integration
- Agricultural advice generation
- Technical support assistance
- Custom prompt handling
- Rate limiting and monitoring
- Error handling and fallbacks

**API Endpoints**:
- `POST /api/chat/message` - Send general message to AI
- `POST /api/chat/simple` - Get simple text response
- `POST /api/chat/agricultural-advice` - Get agricultural advice
- `POST /api/chat/technical-support` - Get technical support
- `POST /api/chat/custom` - Send custom system prompt
- `GET /api/chat/rate-limit` - Get rate limit status
- `POST /api/chat/health` - Health check

## 🔄 Migration Summary

### Changes Made:
1. **Moved Services**: Relocated services to domain-specific packages
2. **Renamed AI Service**: `OpenAIService` → `AIService`
3. **Updated Controllers**: Updated imports and dependencies
4. **Enhanced Security**: Added new endpoint permissions
5. **Updated Tests**: Modified test files to use new package structure

### Benefits:
- **Better Organization**: Domain-specific package structure
- **Improved Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features within domains
- **Team Collaboration**: Different teams can work on different domains
- **Code Reusability**: Services can be easily reused across controllers

## 🚀 Usage Examples

### Contact Service Usage:
```java
@Autowired
private ContactService contactService;

// Save contact
Contact savedContact = contactService.saveContact(contactRequest, ipAddress, userAgent);

// Get statistics
ContactService.ContactStatistics stats = contactService.getStatistics();
```

### Product Service Usage:
```java
@Autowired
private ProductService productService;

// Get all products
List<ProductService.Product> products = productService.getAllProducts();

// Get featured products
List<ProductService.Product> featured = productService.getFeaturedProducts();
```

### Analytics Service Usage:
```java
@Autowired
private AnalyticsService analyticsService;

// Get dashboard analytics
AnalyticsService.DashboardAnalytics analytics = analyticsService.getDashboardAnalytics();

// Get conversion analytics
AnalyticsService.ConversionAnalytics conversion = analyticsService.getConversionAnalytics();
```

### AI Service Usage:
```java
@Autowired
private AIService aiService;

// Send message
Mono<String> response = aiService.sendMessageAndGetResponse("Hello");

// Get agricultural advice
Mono<String> advice = aiService.getAgriculturalAdvice("How to grow tomatoes?");
```

## 📊 API Overview

### Contact Endpoints:
- **POST** `/api/contact` - Submit contact form
- **GET** `/api/contact` - Get all contacts
- **GET** `/api/contact/{id}` - Get contact by ID
- **GET** `/api/contact/statistics` - Get statistics
- **GET** `/api/contact/search` - Search contacts
- **PUT** `/api/contact/{id}/status` - Update status
- **DELETE** `/api/contact/{id}` - Delete contact

### Product Endpoints:
- **GET** `/api/products` - Get all products
- **GET** `/api/products/{id}` - Get product by ID
- **GET** `/api/products/category/{category}` - Get by category
- **GET** `/api/products/search` - Search products
- **GET** `/api/products/featured` - Get featured products
- **GET** `/api/products/statistics` - Get statistics

### Analytics Endpoints:
- **GET** `/api/analytics/dashboard` - Dashboard analytics
- **GET** `/api/analytics/farm-type-distribution` - Farm type distribution
- **GET** `/api/analytics/location-distribution` - Location distribution
- **GET** `/api/analytics/conversion` - Conversion analytics
- **GET** `/api/analytics/performance` - Performance metrics
- **GET** `/api/analytics/daily-trends` - Daily trends

### AI/Chat Endpoints:
- **POST** `/api/chat/message` - General chat
- **POST** `/api/chat/simple` - Simple response
- **POST** `/api/chat/agricultural-advice` - Agricultural advice
- **POST** `/api/chat/technical-support` - Technical support
- **POST** `/api/chat/custom` - Custom prompts
- **GET** `/api/chat/rate-limit` - Rate limit status
- **POST** `/api/chat/health` - Health check

## 🔧 Configuration

### Security Configuration:
All new endpoints are properly configured in `SecurityConfig.java`:
```java
.authorizeHttpRequests(authz -> authz
    .requestMatchers("/contact/**").permitAll()
    .requestMatchers("/chat/**").permitAll()
    .requestMatchers("/analytics/**").permitAll()
    .requestMatchers("/products/**").permitAll()
    // ... other endpoints
)
```

### CORS Configuration:
All endpoints support CORS for frontend integration:
```java
configuration.setAllowedOriginPatterns(List.of(
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://agroconnect-world.com"
));
```

## 🧪 Testing

### Test Structure:
- `OpenAIServiceTest.java` - Updated to use new `AIService`
- `ContactControllerTest.java` - Contact endpoint testing
- Additional tests can be added for new services

### Running Tests:
```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=OpenAIServiceTest

# Run with coverage
mvn test jacoco:report
```

## 🔮 Future Enhancements

### Planned Additions:
1. **User Management**: `user/` package for authentication and user management
2. **Marketplace**: `marketplace/` package for e-commerce functionality
3. **Notifications**: `notifications/` package for email/SMS services
4. **Reports**: `reports/` package for advanced reporting
5. **Integration**: `integration/` package for third-party integrations

### Scalability Considerations:
- Each package can be developed independently
- Services can be easily extended with new features
- Controllers can be split by domain if needed
- Database repositories can be organized by domain

---

**Note**: This package structure provides a clean, scalable foundation for the AgroConnect World backend application. Each domain is self-contained while maintaining clear interfaces for cross-domain communication. 