import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Leaf, 
  Truck, 
  Globe, 
  Package, 
  ArrowRight,
  Clock,
  Shield,
  Users,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Ship,
  Plane
} from 'lucide-react';
import SEO from '../components/SEO';
import analyticsService from '../services/analyticsService';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChatClick = () => {
    analyticsService.trackButtonClick('chat', 'footer');
    // Add chat functionality here
  };

  return (
    <div className="home-page">
      <SEO 
        title="AgroConnect World - Global Import/Export Services | Premium Agricultural Products"
        description="Leading import/export company specializing in premium agricultural products. Professional trade services, global logistics, and reliable sourcing from India to Canada."
        keywords="import export, agricultural products, global trade, logistics, shipping, Canada, India, trade services, international business"
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connecting Global Markets with
              <span className="highlight"> Quality Products</span>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Your trusted partner in importing and exporting premium agricultural products from India to Canada. 
              Professional trade services, global logistics, and reliable sourcing solutions.
            </motion.p>

            <motion.div 
              className="hero-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="feature-item">
                <Globe className="feature-icon" />
                <span>Global Trade Solutions</span>
              </div>
              <div className="feature-item">
                <Shield className="feature-icon" />
                <span>Quality Assurance</span>
              </div>
              <div className="feature-item">
                <Truck className="feature-icon" />
                <span>Reliable Logistics</span>
              </div>
            </motion.div>

            <motion.div 
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.a 
                href="#about-us"
                className="cta-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => analyticsService.trackButtonClick('learn-more', 'hero')}
              >
                Learn More About Us
                <ArrowRight />
              </motion.a>
              
              <motion.a 
                href="#products"
                className="cta-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => analyticsService.trackButtonClick('explore-products', 'hero')}
              >
                <Package />
                Explore Our Products
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="global-trade-visual">
              <div className="world-map-container">
                <div className="india-marker">
                  <MapPin />
                  <span>India</span>
                </div>
                <div className="canada-marker">
                  <MapPin />
                  <span>Canada</span>
                </div>
                <div className="trade-route"></div>
              </div>
              
              <div className="trade-stats">
                <div className="stat-item">
                  <TrendingUp />
                  <div className="stat-content">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Countries Served</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Ship />
                  <div className="stat-content">
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">Successful Shipments</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Users />
                  <div className="stat-content">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Happy Clients</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Import/Export Background Section */}
      <section className="import-export-background">
        <div className="background-overlay"></div>
        <div className="container">
          <motion.div 
            className="background-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="background-text">
              <h2>Global Trade Infrastructure</h2>
              <p>Our extensive network spans major ports, shipping lanes, and logistics hubs worldwide, ensuring efficient and reliable delivery of your agricultural products.</p>
            </div>
            
            <div className="background-visuals">
              <div className="visual-item">
                <div className="visual-icon">
                  <Ship />
                </div>
                <span>Ocean Freight</span>
              </div>
              <div className="visual-item">
                <div className="visual-icon">
                  <Plane />
                </div>
                <span>Air Cargo</span>
              </div>
              <div className="visual-item">
                <div className="visual-icon">
                  <Package />
                </div>
                <span>Container Shipping</span>
              </div>
              <div className="visual-item">
                <div className="visual-icon">
                  <Truck />
                </div>
                <span>Land Transport</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="about-us">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>About AgroConnect World</h2>
            <p>
              AgroConnect World specializes in importing and exporting premium-quality agricultural products, 
              providing reliable solutions for global agricultural trade. We bridge the gap between 
              quality producers and international markets.
            </p>
          </motion.div>

          <motion.div 
            className="value-proposition"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3>Why Choose Us?</h3>
            <div className="values-grid">
              <div className="value-item">
                <Leaf className="value-icon" />
                <h4>Premium Quality Products</h4>
                <p>Carefully sourced agricultural products with strict quality control and certification standards.</p>
              </div>
              <div className="value-item">
                <Shield className="value-icon" />
                <h4>Eco-Friendly & Sustainable</h4>
                <p>Committed to sustainable sourcing practices and environmental responsibility.</p>
              </div>
              <div className="value-item">
                <Truck className="value-icon" />
                <h4>Reliable Global Logistics</h4>
                <p>Efficient shipping and delivery across international borders with real-time tracking.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Import/Export Process */}
      <section id="process" className="process">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>How It Works</h2>
            <p>Our streamlined process ensures quality products reach you on time, every time.</p>
          </motion.div>

          <motion.div 
            className="process-steps"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="step">
              <div className="step-icon">
                <Package />
              </div>
              <h3>Step 1: Sourcing Premium Products</h3>
              <p>We source only the best quality agricultural products from trusted suppliers and certified producers across India.</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <Ship />
              </div>
              <h3>Step 2: Global Logistics & Shipping</h3>
              <p>Efficient logistics and customs handling ensure smooth transportation across international borders.</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <Clock />
              </div>
              <h3>Step 3: On-Time Delivery</h3>
              <p>We guarantee timely and reliable delivery to your location with comprehensive tracking and support.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Our Services</h2>
            <p>Comprehensive import/export solutions for your business needs.</p>
          </motion.div>

          <motion.div 
            className="services-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="service-card">
              <FileText className="service-icon" />
              <h3>Documentation & Compliance</h3>
              <p>Complete import/export documentation, customs clearance, and regulatory compliance assistance.</p>
            </div>
            <div className="service-card">
              <CreditCard className="service-icon" />
              <h3>Payment Solutions</h3>
              <p>Secure international payment methods, trade finance, and currency exchange services.</p>
            </div>
            <div className="service-card">
              <Plane className="service-icon" />
              <h3>Logistics & Shipping</h3>
              <p>End-to-end logistics management, freight forwarding, and supply chain optimization.</p>
            </div>
            <div className="service-card">
              <Shield className="service-icon" />
              <h3>Quality Assurance</h3>
              <p>Product testing, certification, and quality control throughout the supply chain.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Client Testimonials</h2>
            <p>What our clients say about our services.</p>
          </motion.div>

          <motion.div 
            className="testimonials-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"AgroConnect World has been a reliable partner in supplying high-quality agricultural products for our international operations. Their logistics expertise is outstanding."</p>
                <div className="testimonial-author">
                  <strong>Sarah Johnson</strong>
                  <span>Procurement Manager, Global Foods Inc.</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Professional service, on-time delivery, and excellent quality control. They've exceeded our expectations in every aspect of our partnership."</p>
                <div className="testimonial-author">
                  <strong>Michael Chen</strong>
                  <span>Operations Director, NutriSource Ltd.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Start Your Import/Export Journey?</h2>
            <p>Get in touch with our team to discuss your requirements and discover how we can help.</p>
            <div className="cta-buttons">
              <a href="#contact" className="cta-primary">Contact Us Today</a>
              <a href="#products" className="cta-secondary">View Products</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Contact Information</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin />
                  <span>Toronto, Ontario, Canada</span>
                </div>
                <div className="contact-item">
                  <Phone />
                  <span>+1 (416) 555-0123</span>
                </div>
                <div className="contact-item">
                  <Mail />
                  <span>info@agroconnectworld.com</span>
                </div>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#about-us">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><a href="#privacy-policy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#shipping">Shipping Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AgroConnect World. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 