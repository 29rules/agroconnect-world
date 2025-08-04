package com.agroconnect.controller;

import com.agroconnect.dto.ApiResponse;
import com.agroconnect.products.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for product management operations
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://agroconnect-world.com"})
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * GET /api/products - Get all products
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductService.Product>>> getAllProducts() {
        logger.debug("Getting all products");

        try {
            List<ProductService.Product> products = productService.getAllProducts();
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
        } catch (Exception e) {
            logger.error("Error retrieving products: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve products"));
        }
    }

    /**
     * GET /api/products/{id} - Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductService.Product>> getProductById(@PathVariable String id) {
        logger.debug("Getting product by ID: {}", id);

        try {
            Optional<ProductService.Product> product = productService.getProductById(id);
            
            if (product.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error retrieving product with ID: {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve product"));
        }
    }

    /**
     * GET /api/products/category/{category} - Get products by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ProductService.Product>>> getProductsByCategory(@PathVariable String category) {
        logger.debug("Getting products by category: {}", category);

        try {
            List<ProductService.Product> products = productService.getProductsByCategory(category);
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
        } catch (Exception e) {
            logger.error("Error retrieving products by category: {}", category, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve products"));
        }
    }

    /**
     * GET /api/products/availability/{availability} - Get products by availability
     */
    @GetMapping("/availability/{availability}")
    public ResponseEntity<ApiResponse<List<ProductService.Product>>> getProductsByAvailability(@PathVariable String availability) {
        logger.debug("Getting products by availability: {}", availability);

        try {
            List<ProductService.Product> products = productService.getProductsByAvailability(availability);
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
        } catch (Exception e) {
            logger.error("Error retrieving products by availability: {}", availability, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve products"));
        }
    }

    /**
     * GET /api/products/search - Search products
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductService.Product>>> searchProducts(@RequestParam String q) {
        logger.debug("Searching products with query: {}", q);

        try {
            List<ProductService.Product> products = productService.searchProducts(q);
            return ResponseEntity.ok(ApiResponse.success("Products search completed successfully", products));
        } catch (Exception e) {
            logger.error("Error searching products with query: {}", q, e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to search products"));
        }
    }

    /**
     * GET /api/products/categories - Get all product categories
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getProductCategories() {
        logger.debug("Getting product categories");

        try {
            List<String> categories = productService.getProductCategories();
            return ResponseEntity.ok(ApiResponse.success("Product categories retrieved successfully", categories));
        } catch (Exception e) {
            logger.error("Error retrieving product categories: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve product categories"));
        }
    }

    /**
     * GET /api/products/featured - Get featured products
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductService.Product>>> getFeaturedProducts() {
        logger.debug("Getting featured products");

        try {
            List<ProductService.Product> products = productService.getFeaturedProducts();
            return ResponseEntity.ok(ApiResponse.success("Featured products retrieved successfully", products));
        } catch (Exception e) {
            logger.error("Error retrieving featured products: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve featured products"));
        }
    }

    /**
     * GET /api/products/price-range - Get products by price range
     */
    @GetMapping("/price-range")
    public ResponseEntity<ApiResponse<List<ProductService.Product>>> getProductsByPriceRange(
            @RequestParam double minPrice,
            @RequestParam double maxPrice) {
        logger.debug("Getting products by price range: {} - {}", minPrice, maxPrice);

        try {
            List<ProductService.Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
        } catch (Exception e) {
            logger.error("Error retrieving products by price range: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve products"));
        }
    }

    /**
     * GET /api/products/statistics - Get product statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<ProductService.ProductStatistics>> getProductStatistics() {
        logger.debug("Getting product statistics");

        try {
            ProductService.ProductStatistics statistics = productService.getProductStatistics();
            return ResponseEntity.ok(ApiResponse.success("Product statistics retrieved successfully", statistics));
        } catch (Exception e) {
            logger.error("Error retrieving product statistics: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to retrieve product statistics"));
        }
    }
} 