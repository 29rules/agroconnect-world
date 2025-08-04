package com.agroconnect.order.repository;

import com.agroconnect.order.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    List<Order> findByCustomerId(String customerId);
    
    List<Order> findByStatus(String status);
    
    List<Order> findByPaymentStatus(String paymentStatus);
    
    List<Order> findByCustomerIdAndStatus(String customerId, String status);
    
    List<Order> findByOrderDateBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
} 