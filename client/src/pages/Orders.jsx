import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Package, Leaf, Star, CheckCircle, Award
} from 'lucide-react';
import analyticsService from '../services/analyticsService';

// Product data
const products = {
  white: [
    {
      id: 'white-100',
      name: 'White Sesame Seeds - Small Pack',
      size: '100g',
      price: 2.99,
      description: 'Perfect for home cooking and small recipes. Premium quality white sesame seeds.',
      features: ['100% Natural', 'Lab-Tested', 'Non-GMO'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center',
      badge: { icon: Leaf, text: 'Organic' }
    },
    {
      id: 'white-250',
      name: 'White Sesame Seeds - Medium Pack',
      size: '250g',
      price: 6.99,
      description: 'Ideal for regular cooking needs. Premium quality white sesame seeds.',
      features: ['100% Natural', 'Lab-Tested', 'Non-GMO'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center',
      badge: { icon: Leaf, text: 'Organic' }
    },
    {
      id: 'white-500',
      name: 'White Sesame Seeds - Large Pack',
      size: '500g',
      price: 12.99,
      description: 'Great value for bulk cooking. Premium quality white sesame seeds.',
      features: ['100% Natural', 'Lab-Tested', 'Non-GMO'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center',
      badge: { icon: Award, text: 'Best Value' }
    }
  ],
  black: [
    {
      id: 'black-100',
      name: 'Black Sesame Seeds - Small Pack',
      size: '100g',
      price: 2.49,
      description: 'Perfect for garnishing and small recipes. Premium black sesame seeds.',
      features: ['Antioxidant-Rich', 'Iron & Calcium', 'Vegan'],
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center',
      badge: { icon: Star, text: 'Premium' }
    },
    {
      id: 'black-250',
      name: 'Black Sesame Seeds - Medium Pack',
      size: '250g',
      price: 5.99,
      description: 'Ideal for regular cooking needs. Premium black sesame seeds.',
      features: ['Antioxidant-Rich', 'Iron & Calcium', 'Vegan'],
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center',
      badge: { icon: Star, text: 'Premium' }
    },
    {
      id: 'black-500',
      name: 'Black Sesame Seeds - Large Pack',
      size: '500g',
      price: 10.99,
      description: 'Great value for bulk cooking. Premium black sesame seeds.',
      features: ['Antioxidant-Rich', 'Iron & Calcium', 'Vegan'],
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center',
      badge: { icon: Award, text: 'Best Value' }
    }
  ]
};

const Orders = () => {
  // Order section state
  const [quantities, setQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    analyticsService.trackPageVisit(window.location.href, document.title, 'orders');
    
    // Initialize quantities for all products
    const initialQuantities = {};
    [...products.white, ...products.black].forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, []);

  // Order section functions
  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, prev[productId] + change)
    }));
  };

  const handleAddToCart = (product, quantity) => {
    analyticsService.trackButtonClick('add-to-cart', 'order-section');
    
    alert(`${quantity}x ${product.name} (${product.size}) added to cart!`);
  };

  return (
    <div className="orders-page">
      {/* Hero Section */}
      <section className="order-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Premium Sesame Seeds Collection</h1>
            <p className="hero-subtitle">
              Discover our premium selection of organic sesame seeds, sourced from the finest farms 
              and processed to perfection. Perfect for both home cooking and commercial use.
            </p>
            <div className="hero-features">
              <motion.div 
                className="feature"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Package className="feature-icon" />
                <div className="feature-text">
                  <span className="feature-title">Premium Quality</span>
                  <span className="feature-desc">100% Pure & Natural</span>
                </div>
              </motion.div>
              <motion.div 
                className="feature"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="feature-icon" />
                <div className="feature-text">
                  <span className="feature-title">Lab Tested</span>
                  <span className="feature-desc">Quality Guaranteed</span>
                </div>
              </motion.div>
              <motion.div 
                className="feature"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Leaf className="feature-icon" />
                <div className="feature-text">
                  <span className="feature-title">100% Organic</span>
                  <span className="feature-desc">Certified Products</span>
                </div>
              </motion.div>
            </div>
            <div className="hero-banner">
              <div className="shipping-info">
                <ShoppingCart className="banner-icon" />
                <span>Free Shipping on Orders Over $50</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Order Section */}
      <section className="order-section">
        <div className="container">
          <div className="product-category">
            <h2>White Sesame Seeds</h2>
            <div className="order-products-grid">
              {products.white.map((product, index) => (
                <motion.div 
                  key={product.id}
                  className="order-product-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                >
                  <div className="product-image-container">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="product-package-image"
                    />
                    <div className={`product-badge ${product.badge.text.toLowerCase()}`}>
                      <product.badge.icon />
                      <span>{product.badge.text}</span>
                    </div>
                  </div>

                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-features">
                      {product.features.map(feature => (
                        <span key={feature} className="feature">{feature}</span>
                      ))}
                    </div>

                    <div className="price-display">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <span className="size">per {product.size}</span>
                    </div>

                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(product.id, -1)}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={quantities[product.id] || 1} 
                          onChange={(e) => updateQuantity(
                            product.id, 
                            parseInt(e.target.value) || 1
                          )}
                          min="1"
                          className="qty-input"
                        />
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="price-display">
                      <span className="total-price">
                        Total: ${((quantities[product.id] || 1) * product.price).toFixed(2)}
                      </span>
                      {(quantities[product.id] || 1) * product.price >= 50 && (
                        <span className="free-shipping">🚚 Free Shipping!</span>
                      )}
                    </div>

                    <motion.button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product, quantities[product.id] || 1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="product-category">
            <h2>Black Sesame Seeds</h2>
            <div className="order-products-grid">
              {products.black.map((product, index) => (
                <motion.div 
                  key={product.id}
                  className="order-product-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * (index + 3) }}
                >
                  <div className="product-image-container">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="product-package-image"
                    />
                    <div className={`product-badge ${product.badge.text.toLowerCase()}`}>
                      <product.badge.icon />
                      <span>{product.badge.text}</span>
                    </div>
                  </div>

                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-features">
                      {product.features.map(feature => (
                        <span key={feature} className="feature">{feature}</span>
                      ))}
                    </div>

                    <div className="price-display">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <span className="size">per {product.size}</span>
                    </div>

                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(product.id, -1)}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={quantities[product.id] || 1} 
                          onChange={(e) => updateQuantity(
                            product.id, 
                            parseInt(e.target.value) || 1
                          )}
                          min="1"
                          className="qty-input"
                        />
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="price-display">
                      <span className="total-price">
                        Total: ${((quantities[product.id] || 1) * product.price).toFixed(2)}
                      </span>
                      {(quantities[product.id] || 1) * product.price >= 50 && (
                        <span className="free-shipping">🚚 Free Shipping!</span>
                      )}
                    </div>

                    <motion.button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product, quantities[product.id] || 1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Orders; 