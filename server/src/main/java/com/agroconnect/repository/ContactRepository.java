package com.agroconnect.repository;

import com.agroconnect.model.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * MongoDB repository for Contact entity
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {

    /**
     * Find contacts by email address
     */
    List<Contact> findByEmail(String email);

    /**
     * Find contacts by status
     */
    List<Contact> findByStatus(String status);

    /**
     * Find contacts by status with pagination
     */
    Page<Contact> findByStatus(String status, Pageable pageable);

    /**
     * Find contacts created between two dates
     */
    List<Contact> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find contacts by email and status
     */
    List<Contact> findByEmailAndStatus(String email, String status);

    /**
     * Find the most recent contact by email
     */
    Optional<Contact> findFirstByEmailOrderByCreatedAtDesc(String email);

    /**
     * Count contacts by status
     */
    long countByStatus(String status);

    /**
     * Count contacts by newsletter subscription
     */
    long countByNewsletterSubscription(boolean newsletterSubscription);

    /**
     * Find contacts with custom query for search functionality
     */
    @Query("{'$or': [{'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}}, {'subject': {$regex: ?0, $options: 'i'}}]}")
    List<Contact> findBySearchTerm(String searchTerm);

    /**
     * Find contacts with custom query for search functionality with pagination
     */
    @Query("{'$or': [{'firstName': {$regex: ?0, $options: 'i'}}, {'lastName': {$regex: ?0, $options: 'i'}}, {'email': {$regex: ?0, $options: 'i'}}, {'subject': {$regex: ?0, $options: 'i'}}]}")
    Page<Contact> findBySearchTerm(String searchTerm, Pageable pageable);

    /**
     * Find contacts by farm type
     */
    List<Contact> findByFarmType(String farmType);

    /**
     * Find contacts by location
     */
    List<Contact> findByLocation(String location);

    /**
     * Find contacts by preferred contact method
     */
    List<Contact> findByPreferredContactMethod(String preferredContactMethod);

    /**
     * Find contacts created today
     */
    @Query("{'createdAt': {$gte: ?0, $lt: ?1}}")
    List<Contact> findTodayContacts(LocalDateTime startOfDay, LocalDateTime endOfDay);

    /**
     * Find contacts by company name (case-insensitive)
     */
    @Query("{'company': {$regex: ?0, $options: 'i'}}")
    List<Contact> findByCompanyIgnoreCase(String company);

    /**
     * Check if contact exists by email
     */
    boolean existsByEmail(String email);

    /**
     * Delete contacts by email
     */
    void deleteByEmail(String email);

    /**
     * Delete contacts by status
     */
    void deleteByStatus(String status);
} 