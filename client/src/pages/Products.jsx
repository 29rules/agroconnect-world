import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Package, Leaf, TestTube, 
  Globe, MessageCircle,
  ArrowRight, CheckCircle, MapPin, Truck
} from 'lucide-react';

import analyticsService from '../services/analyticsService';
import ProductComparison from '../components/ProductComparison';
import { useToast } from '../components/Toast';

const Products = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [bulkSize, setBulkSize] = useState('20kg');
  const { success } = useToast();

  useEffect(() => {
    analyticsService.trackPageVisit(window.location.href, document.title, 'products');
  }, []);

  const productData = {
    name: 'Premium Sesame Seeds',
    variants: [
      { id: 'black', name: 'Black Sesame', price: { '100g': 2.99, '250g': 6.99, '500g': 12.99, '1kg': 22.99 } },
      { id: 'white', name: 'White Sesame', price: { '100g': 2.49, '250g': 5.99, '500g': 10.99, '1kg': 19.99 } }
    ],
    tags: ['Organic', '99.9% Pure', 'Non-GMO', 'Sustainable'],
    rating: 4.9,
    reviewCount: 132,
    sizes: ['100g', '250g', '500g', '1kg'],
    description: 'Our premium sesame seeds are carefully sourced from fertile lands and undergo rigorous quality testing. These seeds are rich in essential nutrients and perfect for both culinary and commercial use.',
    nutritionalInfo: {
      protein: '18.2g',
      fiber: '11.8g',
      oil: '49.7%',
      calcium: '975mg',
      iron: '14.6mg',
      magnesium: '351mg'
    }
  };



  const handleBuyNow = () => {
    analyticsService.trackButtonClick('buy-now', 'products');
    // Buy now logic here
  };

  const handleBulkQuote = () => {
    analyticsService.trackButtonClick('bulk-quote', 'products');
    window.location.href = '/bulk-orders';
  };

  const handleAddToWishlist = (productName) => {
    success(`${productName} added to wishlist!`);
  };



  const testimonials = [
    {
      id: 1,
      name: 'Chef Maria Santos',
      country: '🇪🇸 Spain',
      rating: 5,
      text: 'The quality is exceptional. Perfect for my bakery.'
    },
    {
      id: 2,
      name: 'John Chen',
      country: '🇨🇦 Canada',
      rating: 5,
      text: 'Best sesame seeds I\'ve ever used. Highly recommended!'
    },
    {
      id: 3,
      name: 'Fatima Al-Zahra',
      country: '🇦🇪 UAE',
      rating: 5,
      text: 'Excellent for traditional Middle Eastern cuisine.'
    }
  ];

  return (
    <div className="products-page">
      {/* Product Showcase */}
      <section className="product-showcase">
        <div className="container">
          <motion.div 
            className="showcase-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Premium Sesame Seeds - Organic & Non-GMO</h1>
            
            <div className="product-images">
              <img src="sesame-seeds.jpg" alt="Sesame Seeds" className="product-image" />
              <img src="bulk-packaging.jpg" alt="Bulk Packaging" className="product-image" />
            </div>
            
            <p className="product-description">
              Our sesame seeds are sustainably sourced from trusted farmers in India. 
              They are Non-GMO, organic, and lab-tested for the highest quality.
            </p>

            {/* Pricing and Bulk Ordering */}
            <div className="pricing">
              <p className="price">Price: $5.99 for 100g</p>
              <div className="bulk-ordering">
                <label htmlFor="bulk-size">Bulk Order Size:</label>
                <select 
                  id="bulk-size" 
                  name="bulk-size"
                  value={bulkSize}
                  onChange={(e) => setBulkSize(e.target.value)}
                >
                  <option value="20kg">20kg</option>
                  <option value="50kg">50kg</option>
                  <option value="100kg">100kg</option>
                </select>
                <motion.button 
                  className="cta-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => analyticsService.trackButtonClick('order-now', 'product-showcase')}
                >
                  Order Now
                </motion.button>
              </div>
            </div>

            {/* Shipping Info */}
            <section className="shipping-info">
              <h3>Shipping & Delivery</h3>
              <p>
                We provide global shipping with reliable delivery times and flexible options. 
                Contact us for bulk shipping quotes.
              </p>
            </section>

            {/* FAQs */}
            <section className="faqs">
              <h3>Frequently Asked Questions</h3>
              <ul>
                <li>What are the shipping times for bulk orders?</li>
                <li>Do you offer product samples?</li>
                <li>How can I place a bulk order?</li>
              </ul>
            </section>
          </motion.div>
        </div>
      </section>

      {/* Hero Banner with Packaging Showcase */}
      <section className="hero-banner">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="sesame-pattern"></div>
        </div>
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Premium Sesame Seeds</h1>
            <p>Organic • Lab-Tested • Sourced from Fertile Lands</p>
            
            {/* Packaging Showcase */}
            <motion.div 
              className="packaging-showcase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="packaging-pair">
                <div className="packaging-item white">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center" 
                    alt="White Sesame Seeds Packaging" 
                  />
                  <div className="packaging-info">
                    <span className="product-type">White Sesame Seeds</span>
                    <span className="weight">100g</span>
                  </div>
                </div>
                <div className="packaging-item black">
                  <img 
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center" 
                    alt="Black Sesame Seeds Packaging" 
                  />
                  <div className="packaging-info">
                    <span className="product-type">Black Sesame Seeds</span>
                    <span className="weight">500g</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="hero-badges">
              <div className="badge">
                <Leaf />
                <span>Organic</span>
              </div>
              <div className="badge">
                <TestTube />
                <span>Lab-Tested</span>
              </div>
              <div className="badge">
                <Globe />
                <span>Global Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Sesame Seeds Section */}
      <section className="our-sesame-seeds">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Our Sesame Seeds</h2>
            <p>Premium Sesame Seeds, Naturally Sourced. Carefully Packed.</p>
          </motion.div>

          <div className="sesame-products-grid">
            {/* White Sesame Seeds */}
            <motion.div 
              className="sesame-product-card white-sesame"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="product-image-section">
                <div className="packaging-image">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center" 
                    alt="White Sesame Seeds Packaging" 
                    className="packaging-photo"
                  />
                  <div className="packaging-overlay">
                    <div className="packaging-label">
                      <div className="brand-name">AGROCONNECT WORLD</div>
                      <div className="product-name">Organic White Sesame Seeds</div>
                      <div className="product-details">100g | Non-GMO | Lab-Tested</div>
                      <div className="origin">Made in India 🇮🇳</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="product-info">
                <h3>White Sesame Seeds</h3>
                <p className="description">
                  Rich in nutrients and delicately nutty in flavor, our white sesame seeds are perfect for culinary and nutritional use. Sourced from certified organic farms in India.
                </p>
                
                <div className="key-features">
                  <h4>Key Features:</h4>
                  <ul>
                    <li><CheckCircle /> 100% Natural & Non-GMO</li>
                    <li><CheckCircle /> Lab-tested for purity</li>
                    <li><CheckCircle /> Ideal for cooking, baking, tahini, salads</li>
                  </ul>
                </div>

                <div className="packaging-info">
                  <h4>Packaging Sizes:</h4>
                  <div className="size-options">
                    <span className="size-option">100g</span>
                    <span className="size-option">250g</span>
                    <span className="size-option">500g</span>
                    <span className="size-option">1kg</span>
                  </div>
                  <p className="packaging-style">
                    <strong>Packaging Style:</strong> Transparent front with resealable zipper pouch. Minimalist label (white + gold theme). QR code for lab report (Coming Soon).
                  </p>
                </div>

                <div className="product-actions">
                  <motion.button 
                    className="btn-primary"
                    onClick={() => handleBuyNow()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Package />
                    Buy Now
                  </motion.button>
                  <motion.button 
                    className="btn-secondary"
                    onClick={() => handleBulkQuote()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle />
                    Request Bulk Quote
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Black Sesame Seeds */}
            <motion.div 
              className="sesame-product-card black-sesame"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="product-image-section">
                <div className="packaging-image">
                  <img 
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center" 
                    alt="Black Sesame Seeds Packaging" 
                    className="packaging-photo"
                  />
                  <div className="packaging-overlay">
                    <div className="packaging-label dark">
                      <div className="brand-name">AGROCONNECT WORLD</div>
                      <div className="product-name">Premium Black Sesame Seeds</div>
                      <div className="product-details">500g | Antioxidant-Rich | Vegan</div>
                      <div className="origin">Made in India 🇮🇳</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="product-info">
                <h3>Black Sesame Seeds</h3>
                <p className="description">
                  Known for their bold flavor and high antioxidant content, our black sesame seeds are a superfood staple. Ideal for holistic health enthusiasts, chefs, and manufacturers.
                </p>
                
                <div className="key-features">
                  <h4>Key Features:</h4>
                  <ul>
                    <li><CheckCircle /> Rich in Iron, Calcium & Zinc</li>
                    <li><CheckCircle /> Supports heart & skin health</li>
                    <li><CheckCircle /> Used in Ayurvedic and Korean cuisine</li>
                  </ul>
                </div>

                <div className="packaging-info">
                  <h4>Packaging Sizes:</h4>
                  <div className="size-options">
                    <span className="size-option">100g</span>
                    <span className="size-option">250g</span>
                    <span className="size-option">500g</span>
                    <span className="size-option">1kg</span>
                  </div>
                  <p className="packaging-style">
                    <strong>Packaging Style:</strong> Matte black pouch with golden typography. Airtight resealable top. Batch number + expiry clearly printed.
                  </p>
                </div>

                <div className="product-actions">
                  <motion.button 
                    className="btn-primary"
                    onClick={() => handleBuyNow()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Package />
                    Buy Now
                  </motion.button>
                  <motion.button 
                    className="btn-secondary"
                    onClick={() => handleBulkQuote()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Package />
                    Order Sample Kit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabbed Details */}
      <section className="product-details-tabs">
        <div className="container">
          <div className="tabs-header">
            {[
              { id: 'description', label: 'Description', icon: <Package /> },
              { id: 'nutritional', label: 'Nutritional Info', icon: <TestTube /> },
              { id: 'reviews', label: 'Reviews', icon: <Star /> }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <motion.div 
                className="description-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>About Our Sesame Seeds</h3>
                <p>{productData.description}</p>
                <div className="features-grid">
                  <div className="feature">
                    <Leaf />
                    <h4>Organic Certified</h4>
                    <p>Grown without synthetic pesticides or fertilizers</p>
                  </div>
                  <div className="feature">
                    <TestTube />
                    <h4>Lab Tested</h4>
                    <p>Rigorous quality testing for purity and safety</p>
                  </div>
                  <div className="feature">
                    <Globe />
                    <h4>Global Sourcing</h4>
                    <p>Sourced from the world's finest growing regions</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'nutritional' && (
              <motion.div 
                className="nutritional-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>Nutritional Information</h3>
                <p>Per 100g serving</p>
                <div className="nutrition-table">
                  <div className="nutrition-row">
                    <span>Protein</span>
                    <span>{productData.nutritionalInfo.protein}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Fiber</span>
                    <span>{productData.nutritionalInfo.fiber}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Oil Content</span>
                    <span>{productData.nutritionalInfo.oil}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Calcium</span>
                    <span>{productData.nutritionalInfo.calcium}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Iron</span>
                    <span>{productData.nutritionalInfo.iron}</span>
                  </div>
                  <div className="nutrition-row">
                    <span>Magnesium</span>
                    <span>{productData.nutritionalInfo.magnesium}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                className="reviews-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>Customer Reviews</h3>
                <div className="reviews-grid">
                  {testimonials.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={i < review.rating ? 'filled' : ''} />
                          ))}
                        </div>
                        <span className="country">{review.country}</span>
                      </div>
                      <p className="review-text">"{review.text}"</p>
                      <span className="reviewer-name">- {review.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>



      {/* Bulk Order CTA */}
      <section className="bulk-order-cta">
        <div className="container">
          <motion.div 
            className="bulk-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bulk-text">
              <h3>Need 100kg+ for Wholesale, Restaurant or Manufacturing?</h3>
              <p>Get special pricing and dedicated support for bulk orders</p>
            </div>
            <motion.button 
              className="bulk-quote-btn"
              onClick={handleBulkQuote}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle />
              Request Bulk Quote
              <ArrowRight />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Product Comparison Section */}
      <section className="comparison-section">
        <div className="container">
          <motion.div 
            className="comparison-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Compare Our Products</h3>
            <p>Find the perfect sesame seeds for your needs</p>
            <ProductComparison />
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="coming-soon-section">
        <div className="container">
          <motion.div 
            className="coming-soon-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Coming Soon: Expanded Product Line</h3>
            <p>We're expanding to roasted sesame, sesame oil, and tahini. Stay tuned!</p>
            <div className="coming-soon-grid">
              <div className="coming-soon-item">
                <Leaf />
                <span>Roasted Sesame Seeds</span>
              </div>
              <div className="coming-soon-item">
                <Leaf />
                <span>Sesame Oil</span>
              </div>
              <div className="coming-soon-item">
                <Leaf />
                <span>Tahini</span>
              </div>
              <div className="coming-soon-item">
                <Leaf />
                <span>Flax Seeds</span>
              </div>
              <div className="coming-soon-item">
                <Leaf />
                <span>Cumin Seeds</span>
              </div>
              <div className="coming-soon-item">
                <Leaf />
                <span>Chia Seeds</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bulk Delivery Details */}
      <section className="bulk-delivery-details">
        <div className="container">
          <motion.div 
            className="delivery-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Packaging & Delivery Details</h3>
            <div className="delivery-grid">
              <div className="delivery-item">
                <MapPin />
                <h4>Origin</h4>
                <p>Gujarat, India</p>
              </div>
              <div className="delivery-item">
                <Package />
                <h4>Private Labeling</h4>
                <p>Available for bulk orders</p>
              </div>
              <div className="delivery-item">
                <Truck />
                <h4>Export-Grade Packaging</h4>
                <p>20kg, 50kg bags also available</p>
              </div>
              <div className="delivery-item">
                <TestTube />
                <h4>Lab Reports & Certifications</h4>
                <p>Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products; 