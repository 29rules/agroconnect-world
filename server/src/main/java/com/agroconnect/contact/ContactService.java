package com.agroconnect.contact;

import com.agroconnect.dto.ContactRequest;
import com.agroconnect.model.Contact;
import com.agroconnect.repository.ContactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for contact form operations
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@Service
@Transactional
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    private final ContactRepository contactRepository;

    @Autowired
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * Save a new contact form submission
     */
    public Contact saveContact(ContactRequest contactRequest, String ipAddress, String userAgent) {
        logger.info("Saving new contact form submission for email: {}", contactRequest.getEmail());

        // Create new contact entity
        Contact contact = new Contact();
        contact.setFirstName(contactRequest.getFirstName());
        contact.setLastName(contactRequest.getLastName());
        contact.setEmail(contactRequest.getEmail());
        contact.setPhone(contactRequest.getPhone());
        contact.setSubject(contactRequest.getSubject());
        contact.setMessage(contactRequest.getMessage());
        contact.setCompany(contactRequest.getCompany());
        contact.setFarmType(contactRequest.getFarmType());
        contact.setFarmSize(contactRequest.getFarmSize());
        contact.setLocation(contactRequest.getLocation());
        contact.setPreferredContactMethod(contactRequest.getPreferredContactMethod());
        contact.setNewsletterSubscription(contactRequest.isNewsletterSubscription());
        contact.setIpAddress(ipAddress);
        contact.setUserAgent(userAgent);
        contact.setStatus("NEW");
        contact.setCreatedAt(LocalDateTime.now());
        contact.setUpdatedAt(LocalDateTime.now());

        // Save to database
        Contact savedContact = contactRepository.save(contact);
        logger.info("Contact form saved successfully with ID: {}", savedContact.getId());

        return savedContact;
    }

    /**
     * Find contact by ID
     */
    @Transactional(readOnly = true)
    public Optional<Contact> findById(String id) {
        logger.debug("Finding contact by ID: {}", id);
        return contactRepository.findById(id);
    }

    /**
     * Find all contacts with pagination
     */
    @Transactional(readOnly = true)
    public Page<Contact> findAll(Pageable pageable) {
        logger.debug("Finding all contacts with pagination: {}", pageable);
        return contactRepository.findAll(pageable);
    }

    /**
     * Find contacts by status
     */
    @Transactional(readOnly = true)
    public List<Contact> findByStatus(String status) {
        logger.debug("Finding contacts by status: {}", status);
        return contactRepository.findByStatus(status);
    }

    /**
     * Find contacts by email
     */
    @Transactional(readOnly = true)
    public List<Contact> findByEmail(String email) {
        logger.debug("Finding contacts by email: {}", email);
        return contactRepository.findByEmail(email);
    }

    /**
     * Search contacts by term
     */
    @Transactional(readOnly = true)
    public List<Contact> searchContacts(String searchTerm) {
        logger.debug("Searching contacts with term: {}", searchTerm);
        return contactRepository.findBySearchTerm(searchTerm);
    }

    /**
     * Search contacts by term with pagination
     */
    @Transactional(readOnly = true)
    public Page<Contact> searchContacts(String searchTerm, Pageable pageable) {
        logger.debug("Searching contacts with term: {} and pagination: {}", searchTerm, pageable);
        return contactRepository.findBySearchTerm(searchTerm, pageable);
    }

    /**
     * Update contact status
     */
    public Contact updateStatus(String id, String status) {
        logger.info("Updating contact status for ID: {} to: {}", id, status);
        
        Optional<Contact> optionalContact = contactRepository.findById(id);
        if (optionalContact.isPresent()) {
            Contact contact = optionalContact.get();
            contact.setStatus(status);
            contact.setUpdatedAt(LocalDateTime.now());
            return contactRepository.save(contact);
        } else {
            logger.warn("Contact not found with ID: {}", id);
            throw new RuntimeException("Contact not found with ID: " + id);
        }
    }

    /**
     * Delete contact by ID
     */
    public void deleteById(String id) {
        logger.info("Deleting contact with ID: {}", id);
        contactRepository.deleteById(id);
    }

    /**
     * Get contact statistics
     */
    @Transactional(readOnly = true)
    public ContactStatistics getStatistics() {
        logger.debug("Getting contact statistics");
        
        long totalContacts = contactRepository.count();
        long newContacts = contactRepository.countByStatus("NEW");
        long processedContacts = contactRepository.countByStatus("PROCESSED");
        long newsletterSubscribers = contactRepository.countByNewsletterSubscription(true);
        
        return new ContactStatistics(totalContacts, newContacts, processedContacts, newsletterSubscribers);
    }

    /**
     * Find contacts created today
     */
    @Transactional(readOnly = true)
    public List<Contact> findTodayContacts() {
        logger.debug("Finding contacts created today");
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return contactRepository.findTodayContacts(startOfDay, endOfDay);
    }

    /**
     * Check if email already exists
     */
    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return contactRepository.existsByEmail(email);
    }

    /**
     * Find contacts by farm type
     */
    @Transactional(readOnly = true)
    public List<Contact> findByFarmType(String farmType) {
        logger.debug("Finding contacts by farm type: {}", farmType);
        return contactRepository.findByFarmType(farmType);
    }

    /**
     * Find contacts by location
     */
    @Transactional(readOnly = true)
    public List<Contact> findByLocation(String location) {
        logger.debug("Finding contacts by location: {}", location);
        return contactRepository.findByLocation(location);
    }

    /**
     * Find contacts by preferred contact method
     */
    @Transactional(readOnly = true)
    public List<Contact> findByPreferredContactMethod(String method) {
        logger.debug("Finding contacts by preferred contact method: {}", method);
        return contactRepository.findByPreferredContactMethod(method);
    }

    /**
     * Inner class for contact statistics
     */
    public static class ContactStatistics {
        private final long totalContacts;
        private final long newContacts;
        private final long processedContacts;
        private final long newsletterSubscribers;

        public ContactStatistics(long totalContacts, long newContacts, long processedContacts, long newsletterSubscribers) {
            this.totalContacts = totalContacts;
            this.newContacts = newContacts;
            this.processedContacts = processedContacts;
            this.newsletterSubscribers = newsletterSubscribers;
        }

        // Getters
        public long getTotalContacts() { return totalContacts; }
        public long getNewContacts() { return newContacts; }
        public long getProcessedContacts() { return processedContacts; }
        public long getNewsletterSubscribers() { return newsletterSubscribers; }
    }
} 