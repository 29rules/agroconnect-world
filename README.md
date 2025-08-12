<<<<<<< HEAD
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
=======
# AgroConnect World - Homepage

A modern, responsive homepage for AgroConnect World, featuring a beautiful hero section, product highlights, and an interactive chatbot.

## Features

- 🎨 **Modern Design**: Clean, professional design with smooth animations
- 📱 **Fully Responsive**: Optimized for all devices and screen sizes
- 🚀 **Interactive Elements**: Smooth scroll animations and hover effects
- 💬 **Chatbot Integration**: Interactive chat button with expandable panel
- ⚡ **Performance Optimized**: Fast loading with optimized assets
- 🎯 **SEO Friendly**: Proper meta tags and semantic HTML

## Sections

1. **Navigation Bar**: Fixed header with logo, menu, and call-to-action buttons
2. **Hero Section**: Compelling headline with statistics and floating cards
3. **Product Highlights**: Three main solutions with feature lists
4. **Features Section**: Why choose AgroConnect World with statistics
5. **Testimonials**: Customer reviews and success stories
6. **Call-to-Action**: Final conversion section
7. **Footer**: Comprehensive site links and information
8. **Chatbot**: Interactive assistant for user support

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Responsive Design**: Mobile-first approach

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agroconnect-world/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the homepage

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
client/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── App.js             # Main React component
│   ├── App.css            # Component-specific styles
│   ├── index.js           # React entry point
│   └── index.css          # Global styles and utilities
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## Design System

### Colors
- **Primary**: `#2d5a27` (Forest Green)
- **Primary Light**: `#4a7c59` (Light Green)
- **Secondary**: `#f8b500` (Golden Yellow)
- **Accent**: `#e74c3c` (Red)
- **Text Primary**: `#2c3e50` (Dark Blue-Gray)
- **Text Secondary**: `#7f8c8d` (Light Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately on all devices

### Components
- **Buttons**: Primary, Secondary, and Outline variants
- **Cards**: Product cards, testimonial cards, and stat cards
- **Navigation**: Fixed header with mobile menu
- **Chatbot**: Floating button with expandable panel

## Customization

### Adding New Sections
1. Create a new section component in `App.js`
2. Add corresponding styles in `App.css`
3. Include proper responsive breakpoints

### Modifying Colors
Update the CSS custom properties in `src/index.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... other colors */
}
```

### Adding Animations
Use Framer Motion for smooth animations:
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Your content here
</motion.div>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lighthouse Score**: 90+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@agroconnectworld.com
- Documentation: [docs.agroconnectworld.com](https://docs.agroconnectworld.com)
- Community: [community.agroconnectworld.com](https://community.agroconnectworld.com)

---

**AgroConnect World** - Revolutionizing Agriculture with Smart Technology 🌱 
>>>>>>> b439a08fcfb8172475f96d4db49272cea973daa6
