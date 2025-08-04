import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, MessageCircle, Phone, Mail, MapPin, 
  Globe, Building, Users, CheckCircle 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import analyticsService from '../services/analyticsService';

const Contact = () => {
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    company: '',
    orderType: '',
    orderSize: '',
    location: '',
    preferredContactMethod: 'email',
    newsletterSubscription: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    analyticsService.trackPageVisit(window.location.href, document.title, 'contact');
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Track form submission
      analyticsService.trackFormSubmission('contact_form', formData);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          company: '',
          orderType: '',
          orderSize: '',
          location: '',
          preferredContactMethod: 'email',
          newsletterSubscription: false
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Get in Touch</h1>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>

        <div className="contact-content">
          {/* Contact Form */}
          <motion.form 
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="orderType">Order Type</label>
                <select 
                  id="orderType" 
                  name="orderType" 
                  value={formData.orderType}
                  onChange={handleInputChange}
                >
                  <option value="">Select order type</option>
                  <option value="sesame">Sesame Seeds</option>
                  <option value="other">Other Products</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="orderSize">Order Size (kg)</label>
                <input 
                  type="number" 
                  id="orderSize" 
                  name="orderSize" 
                  min="0" 
                  value={formData.orderSize}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  placeholder="City, Country" 
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="preferredContactMethod">Preferred Contact Method</label>
              <select 
                id="preferredContactMethod" 
                name="preferredContactMethod" 
                value={formData.preferredContactMethod}
                onChange={handleInputChange}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="newsletterSubscription" 
                  checked={formData.newsletterSubscription}
                  onChange={handleInputChange}
                />
                <span>Subscribe to our newsletter for updates and farming tips</span>
              </label>
            </div>

            {submitStatus === 'success' && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle />
                <span>Thank you for your message! We'll get back to you soon.</span>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>There was an error sending your message. Please try again.</span>
              </motion.div>
            )}

            <motion.button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'} <Send />
            </motion.button>
          </motion.form>

          {/* Contact Information */}
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="info-item">
              <MapPin />
              <div>
                <h4>Visit Us</h4>
                <p>123 Agriculture Street<br />Tech Valley, CA 94000</p>
              </div>
            </div>
            <div className="info-item">
              <Mail />
              <div>
                <h4>Email Us</h4>
                <p>hello@agroconnectworld.com<br />support@agroconnectworld.com</p>
              </div>
            </div>
            <div className="info-item">
              <Phone />
              <div>
                <h4>Call Us</h4>
                <p>+1 (555) 123-4567<br />Mon-Fri 9AM-6PM PST</p>
              </div>
            </div>
            <div className="info-item">
              <Globe />
              <div>
                <h4>Global Support</h4>
                <p>24/7 customer support<br />Available in multiple languages</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div 
          className="additional-info"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="info-grid">
            <div className="info-card">
              <Building />
              <h3>Business Inquiries</h3>
              <p>For partnership opportunities, bulk orders, and business development.</p>
            </div>
            <div className="info-card">
              <Users />
              <h3>Technical Support</h3>
              <p>Get help with our platform, mobile app, and technical issues.</p>
            </div>
            <div className="info-card">
              <MessageCircle />
              <h3>Live Chat</h3>
              <p>Chat with our AI assistant for instant help and support.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact; 