import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title, 
  description, 
  keywords = '', 
  image = '', 
  url = '', 
  type = 'website',
  product = null 
}) => {
  const siteName = 'AgroConnect World';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Premium organic sesame seeds sourced from fertile lands. Lab-tested, non-GMO, and sustainably harvested for the finest quality.';
  const defaultImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=630&fit=crop&crop=center';
  
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const metaUrl = url || window.location.href;

  // Product structured data
  const getProductStructuredData = () => {
    if (!product) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.image,
      "brand": {
        "@type": "Brand",
        "name": "AgroConnect World"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "AgroConnect World"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 0
      } : undefined
    };
  };

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AgroConnect World",
    "url": "https://agroconnectworld.com",
    "logo": "https://agroconnectworld.com/logo.png",
    "description": "Premium organic sesame seeds and agricultural products",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "info@agroconnectworld.com"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="AgroConnect World" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={metaUrl} />
      
      {/* Structured Data */}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify(getProductStructuredData())}
        </script>
      )}
      
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO; 