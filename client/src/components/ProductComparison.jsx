import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Star, Package, Leaf, CheckCircle } from 'lucide-react';
import { useToast } from './Toast';

const ProductComparison = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { success, warning } = useToast();

  // Mock product data
  const availableProducts = [
    {
      id: 1,
      name: 'White Sesame Seeds',
      price: 2.99,
      size: '100g',
      rating: 4.9,
      features: ['Organic', 'Lab-Tested', 'Non-GMO'],
      description: 'Rich in nutrients and delicately nutty in flavor.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Black Sesame Seeds',
      price: 2.49,
      size: '100g',
      rating: 4.8,
      features: ['Antioxidant-Rich', 'Iron & Calcium', 'Vegan'],
      description: 'Bold flavor with high antioxidant content.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Bulk White Sesame',
      price: 19.99,
      size: '1kg',
      rating: 4.7,
      features: ['Wholesale', 'Export Ready', 'Custom Labeling'],
      description: 'Perfect for commercial use and bulk orders.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center'
    }
  ];

  const addToComparison = (product) => {
    if (selectedProducts.length >= 3) {
      warning('You can compare up to 3 products at a time');
      return;
    }
    
    if (selectedProducts.find(p => p.id === product.id)) {
      warning('Product already added to comparison');
      return;
    }
    
    setSelectedProducts(prev => [...prev, product]);
    success(`${product.name} added to comparison`);
  };

  const removeFromComparison = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setSelectedProducts([]);
    setIsOpen(false);
  };

  const toggleComparison = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Comparison Toggle Button */}
      <motion.button
        className="comparison-toggle"
        onClick={toggleComparison}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Scale size={20} />
        <span>Compare Products</span>
        {selectedProducts.length > 0 && (
          <span className="comparison-count">{selectedProducts.length}</span>
        )}
      </motion.button>

      {/* Product Selection Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="comparison-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="comparison-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Compare Products</h3>
                <button onClick={() => setIsOpen(false)} className="close-btn">
                  <X size={20} />
                </button>
              </div>

              <div className="modal-content">
                <div className="product-selection">
                  <h4>Select Products to Compare</h4>
                  <div className="available-products">
                    {availableProducts.map(product => (
                      <motion.div
                        key={product.id}
                        className="product-option"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToComparison(product)}
                      >
                        <img src={product.image} alt={product.name} />
                        <div className="product-info">
                          <h5>{product.name}</h5>
                          <p>${product.price} - {product.size}</p>
                          <div className="rating">
                            <Star size={14} />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        <button className="add-btn">+</button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {selectedProducts.length > 0 && (
                  <div className="comparison-table">
                    <div className="table-header">
                      <h4>Comparison ({selectedProducts.length}/3)</h4>
                      <button onClick={clearComparison} className="clear-btn">
                        Clear All
                      </button>
                    </div>
                    
                    <div className="comparison-grid">
                      <div className="comparison-row header">
                        <div className="feature-label">Product</div>
                        {selectedProducts.map(product => (
                          <div key={product.id} className="product-column">
                            <div className="product-header">
                              <img src={product.image} alt={product.name} />
                              <h5>{product.name}</h5>
                              <button 
                                onClick={() => removeFromComparison(product.id)}
                                className="remove-btn"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="comparison-row">
                        <div className="feature-label">Price</div>
                        {selectedProducts.map(product => (
                          <div key={product.id} className="product-column">
                            ${product.price}
                          </div>
                        ))}
                      </div>

                      <div className="comparison-row">
                        <div className="feature-label">Size</div>
                        {selectedProducts.map(product => (
                          <div key={product.id} className="product-column">
                            {product.size}
                          </div>
                        ))}
                      </div>

                      <div className="comparison-row">
                        <div className="feature-label">Rating</div>
                        {selectedProducts.map(product => (
                          <div key={product.id} className="product-column">
                            <div className="rating-display">
                              <Star size={16} />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="comparison-row">
                        <div className="feature-label">Features</div>
                        {selectedProducts.map(product => (
                          <div key={product.id} className="product-column">
                            <div className="features-list">
                              {product.features.map((feature, index) => (
                                <span key={index} className="feature-tag">
                                  <CheckCircle size={12} />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductComparison; 