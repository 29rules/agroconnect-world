import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, Twitter, Linkedin, Facebook, Instagram, 
  Mail, Phone, MapPin, ArrowUp 
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
              <Globe />
              <span>AgroConnect World</span>
            </div>
            <p>Empowering farmers with modern technology and global connections for a sustainable agricultural future.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram />
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
            <Link to="/admin">Analytics</Link>
          </motion.div>

          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>Services</h4>
            <a href="#">Smart Analytics</a>
            <a href="#">Global Marketplace</a>
            <a href="#">Mobile App</a>
            <a href="#">Support</a>
            <a href="#">Training</a>
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
                <span>123 Agriculture Street<br />Tech Valley, CA 94000</span>
              </div>
              <div className="contact-item">
                <Mail />
                <span>hello@agroconnectworld.com</span>
              </div>
              <div className="contact-item">
                <Phone />
                <span>+1 (555) 123-4567</span>
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
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
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