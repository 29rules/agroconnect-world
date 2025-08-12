import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Users, Mail, Phone, MapPin,
  ArrowRight, CheckCircle, Leaf, TestTube, Globe,
  Star, Upload, FileText, Calculator, Gift
} from 'lucide-react';
import analyticsService from '../services/analyticsService';

const BulkOrders = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    message: '',
    whiteSesameSize: '',
    blackSesameSize: '',
    customLabeling: false,
    labReport: false,
    shippingEstimate: false,
    requestSample: false
  });

  const [selectedProducts, setSelectedProducts] = useState({
    whiteSesame: false,
    blackSesame: false
  });

  useEffect(() => {
    analyticsService.trackPageVisit(window.location.href, document.title, 'bulk-orders');
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductSelection = (product) => {
    setSelectedProducts(prev => ({
      ...prev,
      [product]: !prev[product]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyticsService.trackButtonClick('bulk-order-submit', 'bulk-orders');
    
    // Validate that at least one product is selected
    if (!selectedProducts.whiteSesame && !selectedProducts.blackSesame) {
      alert('Please select at least one product type.');
      return;
    }

    // Validate size selection for selected products
    if (selectedProducts.whiteSesame && !formData.whiteSesameSize) {
      alert('Please select a packaging size for White Sesame Seeds.');
      return;
    }

    if (selectedProducts.blackSesame && !formData.blackSesameSize) {
      alert('Please select a packaging size for Black Sesame Seeds.');
      return;
    }

    // Handle form submission here
    console.log('Bulk order submitted:', { formData, selectedProducts });
    alert('Thanks for your inquiry! We\'ll get back to you within 24 hours with a quote and shipping details.');
  };

  const bulkSizes = ['20kg', '50kg', '100kg'];

  return (
    <div className="bulk-orders-page">
      {/* Hero Section */}
      <section className="bulk-hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Bulk Sesame Seeds — Wholesale Orders & Export Packaging</h1>
            <p>Buy high-quality White & Black Sesame Seeds in bulk. Ideal for retailers, food manufacturers, exporters, and large-scale buyers.</p>
            
            <div className="hero-features">
              <div className="feature">
                <CheckCircle />
                <span>100% Natural</span>
              </div>
              <div className="feature">
                <TestTube />
                <span>Lab-tested</span>
              </div>
              <div className="feature">
                <Leaf />
                <span>Non-GMO</span>
              </div>
              <div className="feature">
                <Package />
                <span>20kg, 50kg, 100kg</span>
              </div>
              <div className="feature">
                <Globe />
                <span>Export-ready</span>
              </div>
              <div className="feature">
                <Star />
                <span>Custom labeling</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Selection Grid */}
      <section className="product-selection-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Select Your Products</h2>
            <p>Choose your preferred sesame seed variants and packaging sizes</p>
          </motion.div>

          <div className="product-selection-grid">
            {/* White Sesame Seeds */}
            <motion.div
              className={`product-selection-card ${selectedProducts.whiteSesame ? 'selected' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="product-image-container">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center"
                  alt="White Sesame Seeds Bulk Packaging"
                  className="product-image"
                />
                <div className="product-badge">
                  <Leaf />
                  <span>Organic</span>
                </div>
                <button
                  className={`select-btn ${selectedProducts.whiteSesame ? 'selected' : ''}`}
                  onClick={() => handleProductSelection('whiteSesame')}
                >
                  {selectedProducts.whiteSesame ? <CheckCircle /> : <Package />}
                  {selectedProducts.whiteSesame ? 'Selected' : 'Select'}
                </button>
              </div>

              <div className="product-details">
                <h3>Organic White Sesame Seeds – Bulk</h3>
                <p className="product-description">
                  Sourced from organic farms, cleaned, lab-tested, and ready for export or large-scale processing.
                </p>

                <div className="size-selector">
                  <label>Select Packaging Size:</label>
                  <div className="size-options">
                    {bulkSizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${formData.whiteSesameSize === size ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, whiteSesameSize: size }))}
                        disabled={!selectedProducts.whiteSesame}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Black Sesame Seeds */}
            <motion.div
              className={`product-selection-card ${selectedProducts.blackSesame ? 'selected' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="product-image-container">
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center"
                  alt="Black Sesame Seeds Bulk Packaging"
                  className="product-image"
                />
                <div className="product-badge premium">
                  <Star />
                  <span>Premium</span>
                </div>
                <button
                  className={`select-btn ${selectedProducts.blackSesame ? 'selected' : ''}`}
                  onClick={() => handleProductSelection('blackSesame')}
                >
                  {selectedProducts.blackSesame ? <CheckCircle /> : <Package />}
                  {selectedProducts.blackSesame ? 'Selected' : 'Select'}
                </button>
              </div>

              <div className="product-details">
                <h3>Premium Black Sesame Seeds – Bulk</h3>
                <p className="product-description">
                  Bold flavor, rich antioxidants — perfect for health food brands, manufacturers, and B2B buyers.
                </p>

                <div className="size-selector">
                  <label>Select Packaging Size:</label>
                  <div className="size-options">
                    {bulkSizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${formData.blackSesameSize === size ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, blackSesameSize: size }))}
                        disabled={!selectedProducts.blackSesame}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bulk Order Inquiry Form */}
      <section className="bulk-form-section">
        <div className="container">
          <div className="form-layout">
            <motion.div
              className="form-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2>Bulk Order Inquiry Form</h2>
              <p>Fill out the form below and our team will get back to you within 24 hours with a customized quote.</p>

              <form onSubmit={handleSubmit} className="bulk-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company Name *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
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
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Shipping Location (City/Country) *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, USA"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Any Specific Requirements (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about your specific requirements, packaging preferences, delivery timeline, etc."
                  ></textarea>
                </div>

                {/* Optional Add-Ons */}
                <div className="add-ons-section">
                  <h3>Optional Add-Ons</h3>
                  <div className="add-ons-grid">
                    <label className="add-on-item">
                      <input
                        type="checkbox"
                        name="customLabeling"
                        checked={formData.customLabeling}
                        onChange={handleInputChange}
                      />
                      <Upload />
                      <span>Custom Labeling (Upload artwork)</span>
                    </label>

                    <label className="add-on-item">
                      <input
                        type="checkbox"
                        name="labReport"
                        checked={formData.labReport}
                        onChange={handleInputChange}
                      />
                      <FileText />
                      <span>Lab Report Required</span>
                    </label>

                    <label className="add-on-item">
                      <input
                        type="checkbox"
                        name="shippingEstimate"
                        checked={formData.shippingEstimate}
                        onChange={handleInputChange}
                      />
                      <Calculator />
                      <span>Need shipping cost estimate?</span>
                    </label>

                    <label className="add-on-item">
                      <input
                        type="checkbox"
                        name="requestSample"
                        checked={formData.requestSample}
                        onChange={handleInputChange}
                      />
                      <Gift />
                      <span>Request a Sample First</span>
                    </label>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="submit-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail />
                  Submit Bulk Inquiry
                  <ArrowRight />
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              className="info-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3>Why Choose Our Bulk Services?</h3>

              <div className="benefits-list">
                <div className="benefit-item">
                  <CheckCircle />
                  <div>
                    <h4>Competitive Pricing</h4>
                    <p>Volume discounts and wholesale rates for bulk orders</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <Leaf />
                  <div>
                    <h4>Premium Quality</h4>
                    <p>All products are organic certified and lab-tested</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <TestTube />
                  <div>
                    <h4>Quality Assurance</h4>
                    <p>Comprehensive testing and certification for every batch</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <Globe />
                  <div>
                    <h4>Global Reach</h4>
                    <p>Export-ready documentation and worldwide shipping</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <Package />
                  <div>
                    <h4>Custom Packaging</h4>
                    <p>Flexible packaging options to meet your requirements</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <Users />
                  <div>
                    <h4>Dedicated Support</h4>
                    <p>Personal account manager for ongoing assistance</p>
                  </div>
                </div>
              </div>

              <div className="contact-info">
                <h4>Need Immediate Assistance?</h4>
                <div className="contact-item">
                  <Phone />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <Mail />
                  <span>bulk@agroconnectworld.com</span>
                </div>
                <div className="contact-item">
                  <MapPin />
                  <span>Global Distribution Center</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkOrders; 