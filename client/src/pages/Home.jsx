import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, TrendingUp, Users, Shield, Zap, ArrowRight, 
  Star, CheckCircle, MessageCircle, Smartphone, Monitor 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import analyticsService from '../services/analyticsService';

const Home = () => {
  const { t } = useTranslation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    analyticsService.init();
    analyticsService.trackPageVisit(window.location.href, document.title, 'homepage');
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    analyticsService.trackButtonClick('chat-toggle', 'floating-button');
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setIsLoading(true);

    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);

    try {
      analyticsService.trackEvent('chat_message_sent', {
        messageLength: userMessage.length,
        timestamp: new Date().toISOString()
      });

      const response = await fetch('http://localhost:8080/api/chat/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory(prev => [...prev, { type: 'bot', message: data.data }]);
      } else {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          message: 'Sorry, I\'m having trouble responding right now. Please try again later.' 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        message: 'Sorry, I\'m having trouble connecting. Please check your internet connection.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Connecting Farmers with Modern Agricultural Solutions</h1>
            <p>Empowering farmers with cutting-edge technology, smart analytics, and a global community to revolutionize agriculture for a sustainable future.</p>
            <div className="hero-buttons">
              <motion.button 
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => analyticsService.trackButtonClick('get-started', 'hero-section')}
              >
                Get Started <ArrowRight />
              </motion.button>
              <motion.button 
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => analyticsService.trackButtonClick('learn-more', 'hero-section')}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-visual">
              <div className="floating-card">
                <TrendingUp />
                <span>Smart Analytics</span>
              </div>
              <div className="floating-card">
                <Users />
                <span>Global Community</span>
              </div>
              <div className="floating-card">
                <Shield />
                <span>Secure Platform</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="products">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Solutions</h2>
            <p>Comprehensive tools and services designed for modern agriculture</p>
          </motion.div>

          <div className="products-grid">
            {[
              {
                icon: <Smartphone />,
                title: "Mobile App",
                description: "Access your farm data anywhere with our intuitive mobile application",
                features: ["Real-time monitoring", "Offline capability", "Push notifications"]
              },
              {
                icon: <Monitor />,
                title: "Smart Analytics",
                description: "AI-powered insights to optimize your farming operations",
                features: ["Predictive analytics", "Weather integration", "Crop recommendations"]
              },
              {
                icon: <Globe />,
                title: "Global Marketplace",
                description: "Connect with suppliers and buyers worldwide",
                features: ["Direct trading", "Quality assurance", "Secure payments"]
              }
            ].map((product, index) => (
              <motion.div 
                key={index}
                className="product-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => analyticsService.trackButtonClick(`product-${index}`, 'products-section')}
              >
                <div className="product-icon">{product.icon}</div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <ul>
                  {product.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose AgroConnect World?</h2>
            <p>Discover the advantages that make us the leading agricultural technology platform</p>
          </motion.div>

          <div className="features-grid">
            {[
              {
                icon: <Zap />,
                title: "Lightning Fast",
                description: "Real-time data processing and instant insights"
              },
              {
                icon: <Shield />,
                title: "Secure & Reliable",
                description: "Enterprise-grade security protecting your valuable data"
              },
              {
                icon: <Users />,
                title: "Community Driven",
                description: "Connect with farmers and experts worldwide"
              },
              {
                icon: <TrendingUp />,
                title: "Data Driven",
                description: "AI-powered recommendations for optimal results"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                onClick={() => analyticsService.trackButtonClick(`feature-${index}`, 'features-section')}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>What Farmers Say</h2>
            <p>Real stories from our global community</p>
          </motion.div>

          <div className="testimonials-grid">
            {[
              {
                name: "Sarah Johnson",
                role: "Organic Farmer",
                location: "California, USA",
                content: "AgroConnect World has transformed how I manage my farm. The analytics are incredibly accurate!",
                rating: 5
              },
              {
                name: "Raj Patel",
                role: "Dairy Farmer",
                location: "Gujarat, India",
                content: "The marketplace feature helped me find better suppliers and increased my profits by 30%.",
                rating: 5
              },
              {
                name: "Maria Santos",
                role: "Vineyard Owner",
                location: "Tuscany, Italy",
                content: "The weather integration and predictive analytics have been game-changers for my vineyard.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => analyticsService.trackButtonClick(`testimonial-${index}`, 'testimonials-section')}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="star filled" />
                  ))}
                </div>
                <p>"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                  <span>{testimonial.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Transform Your Farming?</h2>
            <p>Join thousands of farmers who are already using AgroConnect World to improve their operations</p>
            <motion.button 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => analyticsService.trackButtonClick('cta-signup', 'cta-section')}
            >
              Start Your Free Trial <ArrowRight />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Chat Button */}
      <motion.button 
        className="chat-button"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle />
      </motion.button>

      {/* Chat Window */}
      {isChatOpen && (
        <motion.div 
          className="chat-window"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="chat-header">
            <h3>AgroConnect Assistant</h3>
            <button onClick={toggleChat}>×</button>
          </div>
          <div className="chat-messages">
            {chatHistory.length === 0 && (
              <div className="welcome-message">
                <p>👋 Hello! I'm your agricultural assistant. How can I help you today?</p>
              </div>
            )}
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                <p>{msg.message}</p>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleChatSubmit} className="chat-input">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !chatMessage.trim()}>
              <MessageCircle />
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Home; 