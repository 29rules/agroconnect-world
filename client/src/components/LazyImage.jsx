import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image } from 'lucide-react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  threshold = 0.1,
  fallback = null 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const renderPlaceholder = () => {
    if (placeholder) {
      return placeholder;
    }
    
    return (
      <div className="image-placeholder">
        <Image size={24} />
        <span>Loading...</span>
      </div>
    );
  };

  const renderFallback = () => {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="image-fallback">
        <Image size={24} />
        <span>Image not available</span>
      </div>
    );
  };

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
    >
      {!isInView && renderPlaceholder()}
      
      {isInView && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            scale: isLoaded ? 1 : 0.95 
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}
      
      {hasError && renderFallback()}
      
      {isInView && !isLoaded && !hasError && renderPlaceholder()}
    </div>
  );
};

export default LazyImage; 