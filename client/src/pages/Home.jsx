import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
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
  Plane,
} from 'lucide-react';
import SEO from '../components/SEO';
import analyticsService from '../services/analyticsService';

const Home = () => {
  // track scroll position and toggle a CSS class on hero section
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // wrap analytics tracking in try/catch so failures don't break UI
  const handleAnalytics = (action, location) => {
    try {
      analyticsService.trackButtonClick(action, location);
    } catch (err) {
      console.error('Analytics failed:', err);
    }
  };

  return (
    <div className="home-page">
      <SEO
        title="AgroConnect World - Global Import/Export Services | Premium Agricultural Products"
        description="Leading import/export company specializing in premium agricultural products. Professional trade services, global logistics, and reliable sourcing from India to Canada."
        keywords="import export, agricultural products, global trade, logistics, shipping, Canada, India, trade services, international business"
      />

      {/* HERO SECTION */}
      <section className={`hero-section${isScrolled ? ' scrolled' : ''}`}>
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-content container">
          {/* Left side: headline, description, features and CTAs */}
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
            {/* Feature badges: reuse existing .stats-bar classes for styling */}
            <motion.div
              className="stats-bar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="stat">
                <Globe aria-hidden="true" />
                <span>Global Trade Solutions</span>
              </div>
              <div className="stat">
                <Shield aria-hidden="true" />
                <span>Quality Assurance</span>
              </div>
              <div className="stat">
                <Truck aria-hidden="true" />
                <span>Reliable Logistics</span>
              </div>
            </motion.div>
            {/* Call to action buttons */}
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.a
                href="#about-us"
                className="cta-primary"
                onClick={() => handleAnalytics('learn-more', 'hero')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Us
                <ArrowRight aria-hidden="true" />
              </motion.a>
              <motion.a
                href="#services"
                className="cta-secondary"
                onClick={() => handleAnalytics('explore-services', 'hero')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package aria-hidden="true" />
                Explore Our Services
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right side: map & stats */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="global-trade-visual">
              <div className="world-map-container" aria-hidden="true">
                <div className="india-marker">
                  <MapPin aria-hidden="true" />
                  <span>India</span>
                </div>
                <div className="canada-marker">
                  <MapPin aria-hidden="true" />
                  <span>Canada</span>
                </div>
                <div className="trade-route" />
              </div>
              {/* Reuse stats-bar styles to align these nicely */}
              <div className="stats-bar">
                <div className="stat">
                  <TrendingUp aria-hidden="true" />
                  <div>
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Countries Served</span>
                  </div>
                </div>
                <div className="stat">
                  <Ship aria-hidden="true" />
                    <div>
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">Successful Shipments</span>
                  </div>
                </div>
                <div className="stat">
                  <Users aria-hidden="true" />
                  <div>
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Happy Clients</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMPORT/EXPORT BACKGROUND SECTION */}
      <section className="import-export-background">
        <div className="background-overlay" aria-hidden="true" />
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
              <p>
                Our extensive network spans major ports, shipping lanes, and logistics hubs worldwide,
                ensuring efficient and reliable delivery of your agricultural products.
              </p>
            </div>
            {/* Use existing feature-card styles for transport modes */}
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><Ship aria-hidden="true" /></div>
                <h4>Ocean Freight</h4>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Plane aria-hidden="true" /></div>
                <h4>Air Cargo</h4>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Package aria-hidden="true" /></div>
                <h4>Container Shipping</h4>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Truck aria-hidden="true" /></div>
                <h4>Land Transport</h4>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
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
              AgroConnect World specializes in importing and exporting premium‑quality agricultural products,
              providing reliable solutions for global agricultural trade. We bridge the gap between
              quality producers and international markets.
            </p>
          </motion.div>
          <motion.div
            className="features-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="feature-card">
              <Leaf className="feature-icon" aria-hidden="true" />
              <h4>Premium Quality Products</h4>
              <p>Carefully sourced agricultural products with strict quality control and certification standards.</p>
            </div>
            <div className="feature-card">
              <Shield className="feature-icon" aria-hidden="true" />
              <h4>Eco-Friendly & Sustainable</h4>
              <p>Committed to sustainable sourcing practices and environmental responsibility.</p>
            </div>
            <div className="feature-card">
              <Truck className="feature-icon" aria-hidden="true" />
              <h4>Reliable Global Logistics</h4>
              <p>Efficient shipping and delivery across international borders with real‑time tracking.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROCESS SECTION */}
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
            <div className="process-step">
              <div className="step-icon"><Package aria-hidden="true" /></div>
              <h3>Step 1: Sourcing Premium Products</h3>
              <p>We source only the best quality agricultural products from trusted suppliers and certified producers across India.</p>
            </div>
            <div className="process-step">
              <div className="step-icon"><Ship aria-hidden="true" /></div>
              <h3>Step 2: Global Logistics & Shipping</h3>
              <p>Efficient logistics and customs handling ensure smooth transportation across international borders.</p>
            </div>
            <div className="process-step">
              <div className="step-icon"><Clock aria-hidden="true" /></div>
              <h3>Step 3: On‑Time Delivery</h3>
              <p>We guarantee timely and reliable delivery to your location with comprehensive tracking and support.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
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
              <FileText className="service-icon" aria-hidden="true" />
              <h3>Documentation & Compliance</h3>
              <p>Complete import/export documentation, customs clearance, and regulatory compliance assistance.</p>
            </div>
            <div className="service-card">
              <CreditCard className="service-icon" aria-hidden="true" />
              <h3>Payment Solutions</h3>
              <p>Secure international payment methods, trade finance, and currency exchange services.</p>
            </div>
            <div className="service-card">
              <Plane className="service-icon" aria-hidden="true" />
              <h3>Logistics & Shipping</h3>
              <p>End‑to‑end logistics management, freight forwarding, and supply chain optimization.</p>
            </div>
            <div className="service-card">
              <Shield className="service-icon" aria-hidden="true" />
              <h3>Quality Assurance</h3>
              <p>Product testing, certification, and quality control throughout the supply chain.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
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
                <p>"AgroConnect World has been a reliable partner in supplying high‑quality agricultural products for our international operations. Their logistics expertise is outstanding."</p>
                <div className="testimonial-author">
                  <strong>Sarah Johnson</strong>
                  <span>Procurement Manager, Global Foods Inc.</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Professional service, on‑time delivery, and excellent quality control. They've exceeded our expectations in every aspect of our partnership."</p>
                <div className="testimonial-author">
                  <strong>Michael Chen</strong>
                  <span>Operations Director, NutriSource Ltd.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT CTA SECTION */}
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
            <div className="hero-cta">
              <a href="#contact" className="cta-primary" onClick={() => handleAnalytics('contact', 'cta')}>Contact Us Today</a>
              <a href="#services" className="cta-secondary" onClick={() => handleAnalytics('services', 'cta')}>View Services</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Contact Information</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin aria-hidden="true" />
                  <span>Toronto, Ontario, Canada</span>
                </div>
                <div className="contact-item">
                  <Phone aria-hidden="true" />
                  <span>+1 (416) 555‑0123</span>
                </div>
                <div className="contact-item">
                  <Mail aria-hidden="true" />
                  <span>info@agroconnectworld.com</span>
                </div>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#about-us">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#process">Process</a></li>
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
