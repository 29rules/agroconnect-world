import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ShoppingCart, Package } from 'lucide-react';
import { useToast } from './Toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { success, warning } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      warning('Product already in wishlist');
      return;
    }
    
    setWishlist(prev => [...prev, { ...product, addedAt: new Date().toISOString() }]);
    success(`${product.name} added to wishlist`);
  };

  const removeFromWishlist = (productId) => {
    const product = wishlist.find(item => item.id === productId);
    setWishlist(prev => prev.filter(item => item.id !== productId));
    if (product) {
      success(`${product.name} removed from wishlist`);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    success('Wishlist cleared');
  };

  const moveToCart = (productId) => {
    // This would integrate with your cart system
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      // Add to cart logic here
      removeFromWishlist(productId);
      success(`${product.name} moved to cart`);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    isInWishlist,
    wishlistCount: wishlist.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
      
      {/* Wishlist Toggle Button */}
      <motion.button
        className="wishlist-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart size={20} />
        <span>Wishlist</span>
        {wishlist.length > 0 && (
          <span className="wishlist-count">{wishlist.length}</span>
        )}
      </motion.button>

      {/* Wishlist Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="wishlist-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="wishlist-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>My Wishlist</h3>
                <button onClick={() => setIsOpen(false)} className="close-btn">
                  <X size={20} />
                </button>
              </div>

              <div className="modal-content">
                {wishlist.length === 0 ? (
                  <div className="empty-wishlist">
                    <Heart size={48} />
                    <h4>Your wishlist is empty</h4>
                    <p>Start adding products you love!</p>
                  </div>
                ) : (
                  <>
                    <div className="wishlist-header">
                      <span>{wishlist.length} items in wishlist</span>
                      <button onClick={clearWishlist} className="clear-btn">
                        Clear All
                      </button>
                    </div>
                    
                    <div className="wishlist-items">
                      {wishlist.map((item) => (
                        <motion.div
                          key={item.id}
                          className="wishlist-item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          layout
                        >
                          <div className="item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          
                          <div className="item-details">
                            <h5>{item.name}</h5>
                            <p className="item-price">${item.price}</p>
                            <p className="item-size">{item.size}</p>
                            <p className="item-date">
                              Added {new Date(item.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="item-actions">
                            <button 
                              onClick={() => moveToCart(item.id)}
                              className="move-to-cart-btn"
                              title="Move to cart"
                            >
                              <ShoppingCart size={16} />
                            </button>
                            <button 
                              onClick={() => removeFromWishlist(item.id)}
                              className="remove-btn"
                              title="Remove from wishlist"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </WishlistContext.Provider>
  );
};

export default WishlistProvider; 