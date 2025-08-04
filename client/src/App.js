import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronRight, MessageCircle, Send, 
  Smartphone, Monitor, Globe, TrendingUp, Users, 
  Shield, Zap, ArrowRight, Star, CheckCircle 
} from 'lucide-react';
import analyticsService from './services/analyticsService';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Initialize analytics tracking
  useEffect(() => {
    analyticsService.init();
    
    // Track initial page visit
    analyticsService.trackPageVisit(
      window.location.href,
      document.title,
      'homepage'
    );
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    analyticsService.trackButtonClick('menu-toggle', 'navigation');
  };

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

    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);

    try {
      // Track chat interaction
      analyticsService.trackEvent('chat_message_sent', {
        messageLength: userMessage.length,
        timestamp: new Date().toISOString()
      });

      // Send message to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/chat/simple`, {
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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      company: formData.get('company'),
      farmType: formData.get('farmType'),
      farmSize: formData.get('farmSize'),
      location: formData.get('location'),
      preferredContactMethod: formData.get('preferredContactMethod'),
      newsletterSubscription: formData.get('newsletterSubscription') === 'on'
    };

    try {
      // Track form submission
      analyticsService.trackFormSubmission('contact_form', contactData);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        alert('Thank you for your message! We\'ll get back to you soon.');
        e.target.reset();
      } else {
        alert('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };

  const toggleAdminDashboard = () => {
    setShowAdminDashboard(!showAdminDashboard);
    analyticsService.trackButtonClick('admin-dashboard-toggle', 'navigation');
  };

  if (showAdminDashboard) {
    return <AdminDashboard />;
  }

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Globe className="logo-icon" />
            <span>AgroConnect World</span>
          </motion.div>

          <div className="nav-menu">
            <a href="#home" onClick={() => analyticsService.trackLinkClick('#home', 'Home')}>Home</a>
            <a href="#features" onClick={() => analyticsService.trackLinkClick('#features', 'Features')}>Features</a>
            <a href="#products" onClick={() => analyticsService.trackLinkClick('#products', 'Products')}>Products</a>
            <a href="#contact" onClick={() => analyticsService.trackLinkClick('#contact', 'Contact')}>Contact</a>
            <button 
              className="admin-btn"
              onClick={toggleAdminDashboard}
            >
              Analytics
            </button>
          </div>

          <button className="nav-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#products" onClick={() => setIsMenuOpen(false)}>Products</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <button 
              className="admin-btn"
              onClick={() => {
                setIsMenuOpen(false);
                toggleAdminDashboard();
              }}
            >
              Analytics
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Get in Touch</h2>
            <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </motion.div>

          <div className="contact-content">
            <motion.form 
              className="contact-form"
              onSubmit={handleContactSubmit}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input type="text" id="firstName" name="firstName" required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input type="text" id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input type="text" id="subject" name="subject" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input type="text" id="company" name="company" />
                </div>
                <div className="form-group">
                  <label htmlFor="farmType">Farm Type</label>
                  <select id="farmType" name="farmType">
                    <option value="">Select farm type</option>
                    <option value="crop">Crop Farming</option>
                    <option value="livestock">Livestock</option>
                    <option value="dairy">Dairy</option>
                    <option value="poultry">Poultry</option>
                    <option value="mixed">Mixed Farming</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="farmSize">Farm Size (acres)</label>
                  <input type="number" id="farmSize" name="farmSize" min="0" />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input type="text" id="location" name="location" placeholder="City, Country" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="preferredContactMethod">Preferred Contact Method</label>
                <select id="preferredContactMethod" name="preferredContactMethod">
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="newsletterSubscription" />
                  <span>Subscribe to our newsletter for updates and farming tips</span>
                </label>
              </div>

              <motion.button 
                type="submit" 
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message <Send />
              </motion.button>
            </motion.form>

            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="info-item">
                <Globe />
                <div>
                  <h4>Visit Us</h4>
                  <p>123 Agriculture Street<br />Tech Valley, CA 94000</p>
                </div>
              </div>
              <div className="info-item">
                <MessageCircle />
                <div>
                  <h4>Email Us</h4>
                  <p>hello@agroconnectworld.com<br />support@agroconnectworld.com</p>
                </div>
              </div>
              <div className="info-item">
                <Smartphone />
                <div>
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567<br />Mon-Fri 9AM-6PM PST</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Globe />
                <span>AgroConnect World</span>
              </div>
              <p>Empowering farmers with modern technology and global connections for a sustainable agricultural future.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#features">Features</a>
              <a href="#products">Products</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <a href="#">Smart Analytics</a>
              <a href="#">Marketplace</a>
              <a href="#">Mobile App</a>
              <a href="#">Support</a>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AgroConnect World. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
      <AnimatePresence>
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
              <button onClick={toggleChat}>
                <X />
              </button>
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
                <Send />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App; 