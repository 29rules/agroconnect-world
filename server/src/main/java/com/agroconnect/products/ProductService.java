package com.agroconnect.products;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service for product management functionality
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    /**
     * Get all products
     */
    public List<Product> getAllProducts() {
        logger.debug("Getting all products");
        // TODO: Implement product repository and database integration
        return List.of(
            new Product("1", "Smart Irrigation System", "Automated irrigation system with soil moisture sensors", 
                       "Technology", 299.99, "Available", "High"),
            new Product("2", "Organic Fertilizer", "Natural organic fertilizer for sustainable farming", 
                       "Fertilizer", 49.99, "Available", "Medium"),
            new Product("3", "Crop Monitoring Drone", "Drone with camera for crop monitoring and analysis", 
                       "Technology", 899.99, "Available", "High"),
            new Product("4", "Greenhouse Kit", "Complete greenhouse setup for year-round farming", 
                       "Infrastructure", 599.99, "Available", "Medium"),
            new Product("5", "Soil Testing Kit", "Comprehensive soil testing kit for pH and nutrient analysis", 
                       "Tools", 79.99, "Available", "Low")
        );
    }

    /**
     * Get product by ID
     */
    public Optional<Product> getProductById(String id) {
        logger.debug("Getting product by ID: {}", id);
        return getAllProducts().stream()
            .filter(product -> product.getId().equals(id))
            .findFirst();
    }

    /**
     * Get products by category
     */
    public List<Product> getProductsByCategory(String category) {
        logger.debug("Getting products by category: {}", category);
        return getAllProducts().stream()
            .filter(product -> product.getCategory().equalsIgnoreCase(category))
            .toList();
    }

    /**
     * Get products by availability
     */
    public List<Product> getProductsByAvailability(String availability) {
        logger.debug("Getting products by availability: {}", availability);
        return getAllProducts().stream()
            .filter(product -> product.getAvailability().equalsIgnoreCase(availability))
            .toList();
    }

    /**
     * Search products by name or description
     */
    public List<Product> searchProducts(String searchTerm) {
        logger.debug("Searching products with term: {}", searchTerm);
        String lowerSearchTerm = searchTerm.toLowerCase();
        return getAllProducts().stream()
            .filter(product -> product.getName().toLowerCase().contains(lowerSearchTerm) ||
                             product.getDescription().toLowerCase().contains(lowerSearchTerm))
            .toList();
    }

    /**
     * Get product categories
     */
    public List<String> getProductCategories() {
        logger.debug("Getting product categories");
        return getAllProducts().stream()
            .map(Product::getCategory)
            .distinct()
            .toList();
    }

    /**
     * Get featured products
     */
    public List<Product> getFeaturedProducts() {
        logger.debug("Getting featured products");
        return getAllProducts().stream()
            .filter(product -> "High".equals(product.getPriority()))
            .toList();
    }

    /**
     * Get products by price range
     */
    public List<Product> getProductsByPriceRange(double minPrice, double maxPrice) {
        logger.debug("Getting products by price range: {} - {}", minPrice, maxPrice);
        return getAllProducts().stream()
            .filter(product -> product.getPrice() >= minPrice && product.getPrice() <= maxPrice)
            .toList();
    }

    /**
     * Get product statistics
     */
    public ProductStatistics getProductStatistics() {
        logger.debug("Getting product statistics");
        List<Product> products = getAllProducts();
        
        long totalProducts = products.size();
        long availableProducts = products.stream()
            .filter(product -> "Available".equals(product.getAvailability()))
            .count();
        long highPriorityProducts = products.stream()
            .filter(product -> "High".equals(product.getPriority()))
            .count();
        
        double avgPrice = products.stream()
            .mapToDouble(Product::getPrice)
            .average()
            .orElse(0.0);
        
        return new ProductStatistics(totalProducts, availableProducts, highPriorityProducts, avgPrice);
    }

    /**
     * Product entity
     */
    public static class Product {
        private final String id;
        private final String name;
        private final String description;
        private final String category;
        private final double price;
        private final String availability;
        private final String priority;

        public Product(String id, String name, String description, String category, 
                      double price, String availability, String priority) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.category = category;
            this.price = price;
            this.availability = availability;
            this.priority = priority;
        }

        // Getters
        public String getId() { return id; }
        public String getName() { return name; }
        public String getDescription() { return description; }
        public String getCategory() { return category; }
        public double getPrice() { return price; }
        public String getAvailability() { return availability; }
        public String getPriority() { return priority; }

        @Override
        public String toString() {
            return "Product{" +
                    "id='" + id + '\'' +
                    ", name='" + name + '\'' +
                    ", category='" + category + '\'' +
                    ", price=" + price +
                    ", availability='" + availability + '\'' +
                    '}';
        }
    }

    /**
     * Product Statistics DTO
     */
    public static class ProductStatistics {
        private final long totalProducts;
        private final long availableProducts;
        private final long highPriorityProducts;
        private final double averagePrice;

        public ProductStatistics(long totalProducts, long availableProducts, 
                               long highPriorityProducts, double averagePrice) {
            this.totalProducts = totalProducts;
            this.availableProducts = availableProducts;
            this.highPriorityProducts = highPriorityProducts;
            this.averagePrice = averagePrice;
        }

        // Getters
        public long getTotalProducts() { return totalProducts; }
        public long getAvailableProducts() { return availableProducts; }
        public long getHighPriorityProducts() { return highPriorityProducts; }
        public double getAveragePrice() { return averagePrice; }
    }
} 