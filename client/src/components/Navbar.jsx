import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Globe, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';
import { useWishlist } from './Wishlist';

const Navbar = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const { wishlistCount } = useWishlist();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/orders', label: 'Orders' },
    { path: '/contact', label: 'Contact' },
    { path: '/bulk-orders', label: 'Bulk Orders' }
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'FR', name: 'Français' },
    { code: 'HI', name: 'हिंदी' }
  ];

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    i18n.changeLanguage(langCode.toLowerCase());
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-header">
      <nav className="navbar">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/" onClick={() => handleNavigation('/')}>
            <Leaf className="logo-icon" />
            <span>AgroConnect World</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => handleNavigation(link.path)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="nav-search">
          <SearchBar />
        </div>

        {/* Wishlist Toggle */}
        <div className="nav-wishlist">
          <button className="wishlist-toggle">
            <Heart size={20} />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="wishlist-count">{wishlistCount}</span>
            )}
          </button>
        </div>

        {/* Language Selector */}
        <div className="language-selector">
          <Globe className="globe-icon" />
          <div className="language-dropdown">
            <button className="current-language">
              {currentLanguage}
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className="language-options">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
};

export default Navbar; 