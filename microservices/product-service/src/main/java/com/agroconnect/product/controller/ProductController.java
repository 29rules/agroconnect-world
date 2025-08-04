package com.agroconnect.product.controller;

import com.agroconnect.product.model.Product;
import com.agroconnect.product.service.ProductService;
import com.agroconnect.product.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private AuditService auditService;

    @GetMapping("/")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        auditService.log("system", "VIEW_ALL_PRODUCTS", "Retrieved all products");
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            auditService.logProductViewed("system", product.getName(), product.getId());
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping("/")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        auditService.logProductCreated("system", savedProduct.getName(), savedProduct.getId());
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.updateProduct(product);
        auditService.logProductUpdated("system", updatedProduct.getName(), updatedProduct.getId());
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            auditService.logProductDeleted("system", product.getName(), product.getId());
        }
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        auditService.log("system", "VIEW_PRODUCTS_BY_CATEGORY", "Retrieved products for category: " + category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String query) {
        List<Product> products = productService.searchProducts(query);
        auditService.log("system", "SEARCH_PRODUCTS", "Searched products with query: " + query);
        return ResponseEntity.ok(products);
    }
} 