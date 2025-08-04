# 🌾 AgroConnect World - Import/Export Website

A modern, scalable import/export website for agricultural products built with microservices architecture.

## 🏗️ Architecture Overview

```
agroconnect-world/
├── frontend/                    # React.js Frontend
├── backend-api-gateway/         # Spring Cloud Gateway
├── microservices/
│   ├── product-service/         # Product Management
│   ├── order-service/          # B2B Order Management
│   ├── user-service/           # Authentication & User Management
│   └── audit-log-service/      # Change Tracking & Logging
├── database/                   # MongoDB Setup
└── docker-compose.yml         # Local Development Setup
```

## 🚀 Features

### ✅ Core Features
- **Live Chat Integration** (Crisp Chat)
- **Multi-language Support** (English, French, Spanish)
- **Export Product Catalog PDF**
- **Customer Dashboard** with Order Tracking
- **Admin Analytics Dashboard**
- **Real-time Analytics** (visits, leads, conversions)

### 🛠️ Technical Features
- **Microservices Architecture** with Spring Boot
- **API Gateway** for centralized routing
- **MongoDB** for scalable data storage
- **Docker** containerization
- **React.js** with modern UI/UX
- **Internationalization** (i18n)
- **Responsive Design** for all devices
- **Real-time Chat** with AI assistance

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React i18next** - Internationalization
- **Lucide React** - Icon library

### Backend
- **Spring Boot 3.2** - Microservices framework
- **Spring Cloud Gateway** - API Gateway
- **Spring Data MongoDB** - Database integration
- **Spring Security** - Authentication & authorization
- **Maven** - Dependency management

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **MongoDB** - NoSQL database
- **Nginx** - Web server & reverse proxy

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)
- Maven 3.6+

### 1. Clone the Repository
```bash
git clone <repository-url>
cd agroconnect-world
```

### 2. Start with Docker Compose
```bash
# Start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **MongoDB**: localhost:27017

## 📁 Project Structure

### Frontend (`client/`)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── i18n.js            # Internationalization config
│   └── App.jsx            # Main app component
├── public/                # Static assets
├── package.json           # Dependencies
└── Dockerfile            # Frontend container
```

### Backend Microservices
```
microservices/
├── product-service/       # Product catalog & management
├── order-service/        # B2B order processing
├── user-service/         # User authentication & profiles
└── audit-log-service/    # Change tracking & logging
```

### API Gateway (`backend-api-gateway/`)
```
backend-api-gateway/
├── src/main/java/
│   └── com/agroconnect/gateway/
├── src/main/resources/
│   └── application.yml   # Gateway configuration
└── pom.xml              # Maven dependencies
```

## 🔧 Development

### Local Development Setup

#### Frontend Development
```bash
cd client
npm install
npm start
```

#### Backend Development
```bash
# Product Service
cd microservices/product-service
mvn spring-boot:run

# Order Service
cd microservices/order-service
mvn spring-boot:run

# User Service
cd microservices/user-service
mvn spring-boot:run

# Audit Service
cd microservices/audit-log-service
mvn spring-boot:run

# API Gateway
cd backend-api-gateway
mvn spring-boot:run
```

### Environment Variables

Create `.env` files for each service:

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_CRISP_WEBSITE_ID=your-crisp-website-id
```

#### Backend Services
```env
MONGODB_URI=mongodb://admin:agroconnect123@localhost:27017/agroconnect?authSource=admin
SPRING_PROFILES_ACTIVE=development
```

## 📊 API Endpoints

### Product Service (`/api/products`)
- `GET /` - Get all products
- `GET /{id}` - Get product by ID
- `POST /` - Create new product
- `PUT /{id}` - Update product
- `DELETE /{id}` - Delete product
- `GET /category/{category}` - Get products by category
- `GET /search?query={query}` - Search products

### Order Service (`/api/orders`)
- `GET /` - Get all orders
- `GET /{id}` - Get order by ID
- `POST /` - Create new order
- `PUT /{id}` - Update order
- `DELETE /{id}` - Delete order
- `GET /customer/{customerId}` - Get orders by customer
- `GET /status/{status}` - Get orders by status
- `PUT /{id}/status` - Update order status

### User Service (`/api/users`)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Audit Service (`/api/audit`)
- `GET /logs` - Get audit logs
- `POST /logs` - Create audit log entry
- `GET /logs/{entity}/{entityId}` - Get logs for specific entity

## 🎨 UI/UX Features

### Modern Design
- **Responsive Layout** - Works on all devices
- **Smooth Animations** - Framer Motion powered
- **Dark/Light Mode** - Theme switching
- **Loading States** - Skeleton screens
- **Error Handling** - User-friendly error messages

### User Experience
- **Intuitive Navigation** - Easy-to-use interface
- **Search & Filter** - Advanced product discovery
- **Real-time Updates** - Live data synchronization
- **Offline Support** - Progressive Web App features
- **Accessibility** - WCAG 2.1 compliant

## 🔒 Security

### Authentication & Authorization
- **JWT Tokens** - Secure authentication
- **Role-based Access** - User permissions
- **API Rate Limiting** - DDoS protection
- **CORS Configuration** - Cross-origin security
- **Input Validation** - XSS prevention

### Data Protection
- **Encrypted Storage** - Sensitive data protection
- **Audit Logging** - Complete change tracking
- **Backup Strategy** - Data recovery
- **GDPR Compliance** - Privacy regulations

## 📈 Analytics & Monitoring

### Built-in Analytics
- **Page Views** - User behavior tracking
- **Conversion Tracking** - Lead generation
- **Performance Metrics** - Load times & errors
- **User Engagement** - Session duration & interactions

### Monitoring
- **Health Checks** - Service status monitoring
- **Error Tracking** - Exception monitoring
- **Performance Monitoring** - Response times
- **Log Aggregation** - Centralized logging

## 🚀 Deployment

### Production Deployment

#### 1. Build Images
```bash
docker-compose -f docker-compose.prod.yml build
```

#### 2. Deploy to Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. Environment Setup
```bash
# Set production environment variables
export NODE_ENV=production
export MONGODB_URI=mongodb://your-production-db
export API_GATEWAY_URL=https://your-api-gateway.com
```

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy
        run: |
          docker-compose -f docker-compose.prod.yml build
          docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety (optional)
- **JUnit** - Unit testing
- **Integration Tests** - API testing

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](CONTRIBUTING.md)

### Contact
- **Email**: support@agroconnectworld.com
- **Website**: https://agroconnectworld.com
- **Documentation**: https://docs.agroconnectworld.com

## 🎯 Roadmap

### Upcoming Features
- [ ] **Mobile App** - React Native application
- [ ] **AI Chatbot** - Advanced customer support
- [ ] **Blockchain Integration** - Supply chain transparency
- [ ] **IoT Integration** - Smart farming sensors
- [ ] **Marketplace** - B2B trading platform
- [ ] **Analytics Dashboard** - Advanced reporting
- [ ] **Payment Gateway** - Secure transactions
- [ ] **Notification System** - Real-time alerts

### Performance Improvements
- [ ] **Caching Layer** - Redis integration
- [ ] **CDN** - Global content delivery
- [ ] **Database Optimization** - Query performance
- [ ] **Image Optimization** - WebP format support
- [ ] **Code Splitting** - Lazy loading

---

**Built with ❤️ for the agricultural community** 