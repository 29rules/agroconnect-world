import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUp, 
  MessageSquare, Package, Leaf 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              <Leaf />
              <span>AgroConnect World</span>
            </div>
            <p>Delivering premium sesame seeds to the world. Pure. Lab-Tested. Sustainably Grown.</p>
            <div className="social-links">
              <a href="https://instagram.com/agroconnectworld" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram />
              </a>
              <a href="https://linkedin.com/company/agroconnectworld" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin />
              </a>
              <a href="https://wa.me/1234567890" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <MessageSquare />
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/bulk">Bulk Orders</Link>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>Products</h4>
            <a href="/products/black-sesame">Black Sesame Seeds</a>
            <a href="/products/white-sesame">White Sesame Seeds</a>
            <a href="/bulk">Bulk Orders</a>
            <a href="/samples">Sample Kits</a>
            <a href="/export">Export Documentation</a>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin />
                <span>Global Distribution Center<br />Quality Agriculture Hub</span>
              </div>
              <div className="contact-item">
                <Mail />
                <span>sales@agroconnectworld.com</span>
              </div>
              <div className="contact-item">
                <Phone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <Package />
                <span>Bulk Orders: +1 (555) 987-6543</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-content">
            <p>&copy; 2024 AgroConnect World. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button 
        className="scroll-to-top"
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp />
      </motion.button>
    </footer>
  );
};

export default Footer; 