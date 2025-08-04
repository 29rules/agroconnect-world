import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ShoppingCart, Eye, Download, 
  CheckCircle, Package, Globe, Leaf, TestTube 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import analyticsService from '../services/analyticsService';

const Products = () => {
  const { i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);

  const categories = [
    'all', 'black-sesame', 'white-sesame', 'organic', 'premium', 'bulk'
  ];

  useEffect(() => {
    analyticsService.trackPageVisit(window.location.href, document.title, 'products');
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy, showOrganicOnly]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/products/`);
      setProducts(response.data);
      analyticsService.trackEvent('products_loaded', { count: response.data.length });
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample data
      setProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  const getSampleProducts = () => [
    {
      id: '1',
      name: 'Black Sesame Seeds',
      description: 'Premium black sesame seeds with strong aroma, perfect for cuisine and oil extraction',
      category: 'black-sesame',
      price: 3.50,
      currency: 'USD',
      unit: 'kg',
      stockQuantity: 1000,
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      tags: ['organic', 'premium', 'black', 'export'],
      supplier: 'Ethiopian Farmers Co-op',
      origin: 'Ethiopia',
      qualityGrade: 'A',
      isOrganic: true,
      isAvailable: true,
      packaging: ['100g', '250g', '500g', '1kg']
    },
    {
      id: '2',
      name: 'White Sesame Seeds',
      description: 'Mild-tasting white sesame seeds ideal for baking and salad usage',
      category: 'white-sesame',
      price: 2.80,
      currency: 'USD',
      unit: 'kg',
      stockQuantity: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      tags: ['organic', 'mild', 'white', 'baking'],
      supplier: 'Indian Sesame Co-op',
      origin: 'India',
      qualityGrade: 'A',
      isOrganic: true,
      isAvailable: true,
      packaging: ['100g', '250g', '500g', '1kg']
    },
    {
      id: '3',
      name: 'Premium Organic Sesame Mix',
      description: 'Premium blend of black and white sesame seeds for gourmet applications',
      category: 'premium',
      price: 4.20,
      currency: 'USD',
      unit: 'kg',
      stockQuantity: 800,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      tags: ['organic', 'premium', 'blend', 'gourmet'],
      supplier: 'AgroConnect Premium',
      origin: 'Mixed',
      qualityGrade: 'A+',
      isOrganic: true,
      isAvailable: true,
      packaging: ['250g', '500g', '1kg', '5kg']
    }
  ];

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesOrganic = !showOrganicOnly || product.isOrganic;
      
      return matchesSearch && matchesCategory && matchesOrganic;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    analyticsService.trackEvent('product_viewed', {
      productId: product.id,
      productName: product.name,
      category: product.category
    });
  };

  const handleAddToCart = (product) => {
    analyticsService.trackEvent('product_added_to_cart', {
      productId: product.id,
      productName: product.name,
      price: product.price
    });
    // TODO: Implement cart functionality
    alert(`${product.name} added to cart!`);
  };

  const exportCatalog = () => {
    analyticsService.trackEvent('catalog_exported', {
      productCount: filteredProducts.length
    });
    // TODO: Implement PDF export
    alert('Product catalog export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Agricultural Products</h1>
          <p>Discover high-quality products from our global network of suppliers</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="filters-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showOrganicOnly}
                  onChange={(e) => setShowOrganicOnly(e.target.checked)}
                />
                Organic Only
              </label>
            </div>

            <button className="btn btn-secondary" onClick={exportCatalog}>
              <Download /> Export Catalog
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="products-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <Package />
              <h3>No products found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="product-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                  {product.isOrganic && (
                    <div className="organic-badge">
                      <CheckCircle /> Organic
                    </div>
                  )}
                  <div className="product-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleProductClick(product)}
                    >
                      <Eye />
                    </button>
                    <button 
                      className="action-btn cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart />
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  
                  <div className="product-meta">
                    <span className="category">{product.category}</span>
                    <span className="origin">
                      <Globe /> {product.origin}
                    </span>
                  </div>

                  <div className="product-details">
                    <div className="price">
                      <span className="amount">${product.price}</span>
                      <span className="unit">/{product.unit}</span>
                    </div>
                    <div className="stock">
                      <span className={product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  <div className="product-footer">
                    <div className="supplier">
                      <span>Supplier: {product.supplier}</span>
                    </div>
                    <div className="quality">
                      <span>Grade: {product.qualityGrade}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Results Summary */}
        <motion.div 
          className="results-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>Showing {filteredProducts.length} of {products.length} products</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Products; 