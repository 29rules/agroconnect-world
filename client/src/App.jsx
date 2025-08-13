import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import BulkOrders from './pages/BulkOrders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import ToastProvider from './components/Toast';
import WishlistProvider from './components/Wishlist';
import './App.css';

// Page transition wrapper component
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <WishlistProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main>
                <Suspense fallback={<LoadingSpinner message="Loading page..." size="large" />}>
                  <PageTransition>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/bulk-orders" element={<BulkOrders />} />
                    </Routes>
                  </PageTransition>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App; 