import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ShoppingCart, Package, Phone, Globe, CheckCircle, Star, 
  ArrowRight, MessageCircle, Mail, Leaf, TestTube, Truck, Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import analyticsService from '../services/analyticsService';

const Home = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    analyticsService.trackPageVisit(window.location.href, document.title, 'home');
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChatClick = () => {
    analyticsService.trackButtonClick('chat-button', 'home');
    // Chat functionality would go here
  };

  return (
    <div className="home-page">
      {/* Hero Section with Premium Design */}
      <motion.section 
        className={`hero-section ${isScrolled ? 'scrolled' : ''}`}
        style={{ y, opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Elements */}
        <div className="hero-background">
          <motion.div 
            className="floating-seeds"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="seed seed-1">🌱</div>
            <div className="seed seed-2">🌱</div>
            <div className="seed seed-3">🌱</div>
          </motion.div>
          
          <motion.div 
            className="gradient-overlay"
            animate={{ 
              background: [
                "linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(218, 165, 32, 0.1) 50%, rgba(244, 164, 96, 0.1) 100%)",
                "linear-gradient(135deg, rgba(244, 164, 96, 0.1) 0%, rgba(139, 69, 19, 0.1) 50%, rgba(218, 165, 32, 0.1) 100%)",
                "linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(218, 165, 32, 0.1) 50%, rgba(244, 164, 96, 0.1) 100%)"
              ]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container">
          <div className="hero-content">
            {/* Left Side - Text Content */}
            <motion.div 
              className="hero-text"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="hero-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Leaf className="badge-icon" />
                <span>Premium Quality • Lab Tested • Global Delivery</span>
              </motion.div>

              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Delivering Premium
                <span className="highlight"> Sesame Seeds</span>
                <br />to the World
              </motion.h1>

              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Pure. Lab-Tested. Sustainably Grown. Experience the finest quality 
                black and white sesame seeds sourced from the world's most fertile regions.
              </motion.p>

              <motion.div 
                className="hero-stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Countries Served</span>
                </div>
                <div className="stat">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Purity Rate</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </motion.div>

              <motion.div 
                className="hero-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.button 
                  className="cta-primary"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 69, 19, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => analyticsService.trackButtonClick('shop-now', 'hero')}
                >
                  <ShoppingCart />
                  Shop Now
                  <ArrowRight />
                </motion.button>
                
                <motion.button 
                  className="cta-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => analyticsService.trackButtonClick('bulk-order', 'hero')}
                >
                  <Package />
                  Request Bulk Order
                </motion.button>
                
                <motion.button 
                  className="cta-contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => analyticsService.trackButtonClick('contact-us', 'hero')}
                >
                  <Phone />
                  Contact Us
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Visual Content */}
            <motion.div 
              className="hero-visual"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="product-showcase">
                <motion.div 
                  className="sesame-jar"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="jar-container">
                    <div className="jar-top"></div>
                    <div className="jar-body">
                      <div className="sesame-seeds">
                        <span className="seed-black">⚫</span>
                        <span className="seed-white">⚪</span>
                        <span className="seed-black">⚫</span>
                        <span className="seed-white">⚪</span>
                        <span className="seed-black">⚫</span>
                      </div>
                    </div>
                    <div className="jar-label">
                      <span>Premium</span>
                      <span>Sesame Seeds</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="quality-badges"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  <div className="badge organic">
                    <CheckCircle />
                    <span>Organic</span>
                  </div>
                  <div className="badge tested">
                    <TestTube />
                    <span>Lab Tested</span>
                  </div>
                  <div className="badge global">
                    <Globe />
                    <span>Global</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="floating-elements"
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="floating-icon icon-1">🌱</div>
                  <div className="floating-icon icon-2">⭐</div>
                  <div className="floating-icon icon-3">🌍</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="scroll-arrow"></div>
          <span>Scroll to explore</span>
        </motion.div>
      </motion.section>

      {/* Language Switcher */}
      <div className="language-switcher">
        <Globe className="globe-icon" />
        <div className="language-options">
          {['EN', 'FR', 'HI'].map((lang) => (
            <button
              key={lang}
              className={`lang-btn ${lang === 'EN' ? 'active' : ''}`}
              onClick={() => analyticsService.trackEvent('language_change', { language: lang })}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Product Focus Section */}
      <section className="products">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Premium Sesame Seeds</h2>
            <p>Discover our carefully selected varieties of the finest sesame seeds</p>
          </motion.div>

          <div className="sesame-grid">
            {[
              {
                type: 'Black Sesame',
                description: 'Strong aroma, perfect for cuisine & oil extraction',
                features: ['High Oil Content', 'Rich Flavor', 'Traditional Use'],
                image: '⚫',
                color: 'black'
              },
              {
                type: 'White Sesame',
                description: 'Mild taste, ideal for baking and salads',
                features: ['Mild Flavor', 'Versatile Use', 'Premium Quality'],
                image: '⚪',
                color: 'white'
              }
            ].map((product, index) => (
              <motion.div 
                key={product.type}
                className={`sesame-card ${product.color}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="card-header">
                  <div className="product-icon">{product.image}</div>
                  <h3>{product.type}</h3>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-features">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="feature">
                      <CheckCircle />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <motion.button 
                  className="view-details-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => analyticsService.trackButtonClick('view-details', product.type)}
                >
                  View Details
                  <ArrowRight />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose Us?</h2>
            <p>We're committed to delivering the highest quality sesame seeds worldwide</p>
          </motion.div>

          <div className="features-grid">
            {[
              {
                icon: <TestTube />,
                title: 'Lab Verified Purity',
                description: 'Every batch undergoes rigorous testing to ensure 99.9% purity and quality standards.'
              },
              {
                icon: <Leaf />,
                title: 'Ethically Sourced',
                description: 'We work directly with farmers who practice sustainable and ethical farming methods.'
              },
              {
                icon: <Truck />,
                title: 'Fast Global Shipping',
                description: 'Efficient logistics network ensuring your orders reach you anywhere in the world.'
              },
              {
                icon: <Users />,
                title: 'B2B and B2C Friendly',
                description: 'Whether you need bulk orders or retail packages, we cater to all your needs.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>What Our Customers Say</h2>
            <p>Trusted by chefs, bakers, and food manufacturers worldwide</p>
          </motion.div>

          <div className="testimonials-grid">
            {[
              {
                text: "The texture and flavor are unmatched. Will definitely reorder!",
                author: "Chef Maria",
                role: "Executive Chef",
                rating: 5
              },
              {
                text: "Perfect for our bakery. Consistent quality every time.",
                author: "Baker John",
                role: "Artisan Baker",
                rating: 5
              },
              {
                text: "Excellent service and premium quality seeds. Highly recommended!",
                author: "Food Manufacturer",
                role: "Quality Manager",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="star" fill="gold" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Buyers Section */}
      <section className="bulk-buyers">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Bulk Buyers & Distributors</h2>
            <p>Looking for high-quality sesame seeds in bulk? We've got you covered.</p>
          </motion.div>

          <div className="bulk-features">
            <motion.div 
              className="bulk-feature"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <CheckCircle />
              <span>Custom packaging solutions</span>
            </motion.div>
            <motion.div 
              className="bulk-feature"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <CheckCircle />
              <span>Tiered pricing for volume orders</span>
            </motion.div>
            <motion.div 
              className="bulk-feature"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <CheckCircle />
              <span>Export-ready documentation</span>
            </motion.div>
            <motion.div 
              className="bulk-feature"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <CheckCircle />
              <span>Dedicated support team</span>
            </motion.div>
          </div>

          <motion.button 
            className="request-quote-btn"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => analyticsService.trackButtonClick('request-quote', 'bulk-section')}
          >
            <Mail />
            Request Quote
          </motion.button>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="contact-banner">
        <div className="container">
          <motion.div 
            className="banner-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Let's talk quality agriculture</h2>
            <p>Ready to experience the finest sesame seeds? Get in touch with our team.</p>
            <div className="banner-buttons">
              <motion.button 
                className="contact-sales-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => analyticsService.trackButtonClick('contact-sales', 'banner')}
              >
                <Phone />
                Contact Sales
              </motion.button>
              <motion.button 
                className="sample-kit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => analyticsService.trackButtonClick('sample-kit', 'banner')}
              >
                <Package />
                Request Sample Kit
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Visual */}
      <section className="process-visual">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Process</h2>
            <p>From farm to your table - our commitment to quality at every step</p>
          </motion.div>

          <div className="process-steps">
            {[
              { step: 'Selection', icon: '🌱', description: 'Careful selection of the finest seeds' },
              { step: 'Harvest', icon: '🌾', description: 'Optimal harvesting at peak maturity' },
              { step: 'Testing', icon: '🔬', description: 'Rigorous quality and purity testing' },
              { step: 'Packaging', icon: '📦', description: 'Premium packaging for freshness' },
              { step: 'Shipping', icon: '🚢', description: 'Global shipping to your doorstep' }
            ].map((process, index) => (
              <motion.div 
                key={process.step}
                className="process-step"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="step-icon">{process.icon}</div>
                <h3>{process.step}</h3>
                <p>{process.description}</p>
                {index < 4 && <div className="step-arrow">→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="newsletter">
        <div className="container">
          <motion.div 
            className="newsletter-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Stay Updated</h2>
            <p>Get updates when we add new products and special offers</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="email-input"
              />
              <motion.button 
                className="subscribe-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => analyticsService.trackButtonClick('newsletter-subscribe', 'newsletter')}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chat Widget */}
      <motion.button 
        className="chat-widget"
        onClick={handleChatClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <MessageCircle />
      </motion.button>
    </div>
  );
};

export default Home; 