package com.agroconnect.product.repository;

import com.agroconnect.product.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    List<Product> findByCategory(String category);
    
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    
    List<Product> findByIsAvailableTrue();
    
    List<Product> findByIsOrganicTrue();
    
    List<Product> findBySupplier(String supplier);
    
    List<Product> findByOrigin(String origin);
} 