import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Globe, ChevronDown, User, Settings, 
  BarChart3, ShoppingCart, Bell 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import analyticsService from '../services/analyticsService';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    analyticsService.trackButtonClick('menu-toggle', 'navigation');
  };

  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsLanguageOpen(false);
    analyticsService.trackEvent('language_changed', { language: languageCode });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <motion.div 
          className="nav-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <Globe className="logo-icon" />
            <span>AgroConnect World</span>
          </Link>
        </motion.div>

        <div className="nav-menu">
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
            onClick={() => analyticsService.trackLinkClick('/', 'Home')}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={isActive('/products') ? 'active' : ''}
            onClick={() => analyticsService.trackLinkClick('/products', 'Products')}
          >
            Products
          </Link>
          <Link 
            to="/orders" 
            className={isActive('/orders') ? 'active' : ''}
            onClick={() => analyticsService.trackLinkClick('/orders', 'Orders')}
          >
            Orders
          </Link>
          <Link 
            to="/contact" 
            className={isActive('/contact') ? 'active' : ''}
            onClick={() => analyticsService.trackLinkClick('/contact', 'Contact')}
          >
            Contact
          </Link>
          <Link 
            to="/admin" 
            className="admin-btn"
            onClick={() => analyticsService.trackLinkClick('/admin', 'Admin')}
          >
            <BarChart3 /> Analytics
          </Link>
        </div>

        <div className="nav-actions">
          {/* Language Switcher */}
          <div className="language-switcher">
            <button 
              className="language-btn"
              onClick={toggleLanguage}
              onBlur={() => setTimeout(() => setIsLanguageOpen(false), 200)}
            >
              <Globe />
              <span>{languages.find(lang => lang.code === i18n.language)?.flag || '🇺🇸'}</span>
              <ChevronDown />
            </button>
            
            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div 
                  className="language-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
                      onClick={() => changeLanguage(language.code)}
                    >
                      <span className="flag">{language.flag}</span>
                      <span className="name">{language.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Actions */}
          <div className="user-actions">
            <button className="action-btn">
              <Bell />
            </button>
            <button className="action-btn">
              <ShoppingCart />
            </button>
            <button className="action-btn">
              <User />
            </button>
          </div>

          <button className="nav-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
              <BarChart3 /> Analytics
            </Link>
            
            {/* Mobile Language Switcher */}
            <div className="mobile-language">
              <h4>Language</h4>
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`mobile-language-option ${i18n.language === language.code ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage(language.code);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="flag">{language.flag}</span>
                  <span className="name">{language.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 