import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Mock product data - replace with actual API call
  const products = [
    { id: 1, name: 'White Sesame Seeds', category: 'Seeds', price: 2.99, path: '/products' },
    { id: 2, name: 'Black Sesame Seeds', category: 'Seeds', price: 2.49, path: '/products' },
    { id: 3, name: 'Bulk White Sesame', category: 'Bulk', price: 19.99, path: '/bulk-orders' },
    { id: 4, name: 'Bulk Black Sesame', category: 'Bulk', price: 18.99, path: '/bulk-orders' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const searchResults = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setResults(searchResults);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    handleSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="search-input"
        />
        {query && (
          <button onClick={clearSearch} className="clear-search-btn">
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || isLoading) && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <div className="search-loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p>Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="results-list">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={product.path}
                    className="result-item"
                    onClick={handleResultClick}
                  >
                    <Package size={16} />
                    <div className="result-content">
                      <span className="result-name">{product.name}</span>
                      <span className="result-category">{product.category}</span>
                    </div>
                    <span className="result-price">${product.price}</span>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <div className="no-results">
                <p>No products found for "{query}"</p>
                <span>Try different keywords</span>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 