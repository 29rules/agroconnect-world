package com.agroconnect.controller;

import com.agroconnect.contact.ContactService;
import com.agroconnect.dto.ApiResponse;
import com.agroconnect.dto.ContactRequest;
import com.agroconnect.model.Contact;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for contact form operations
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://agroconnect-world.com"})
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /**
     * POST /api/contact - Submit a new contact form
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> submitContact(
            @Valid @RequestBody ContactRequest contactRequest,
            HttpServletRequest request) {
        
        logger.info("Received contact form submission from: {}", contactRequest.getEmail());

        try {
            // Extract client information
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");

            // Save contact form
            Contact savedContact = contactService.saveContact(contactRequest, ipAddress, userAgent);

            logger.info("Contact form submitted successfully for: {}", contactRequest.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Contact form submitted successfully", savedContact));

        } catch (Exception e) {
            logger.error("Error submitting contact form for: {}", contactRequest.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to submit contact form. Please try again."));
        }
    }

    /**
     * GET /api/contact - Get all contacts with pagination
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Contact>>> getAllContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        logger.debug("Getting all contacts with pagination: page={}, size={}, sortBy={}, sortDir={}", 
                page, size, sortBy, sortDir);

        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                    Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Contact> contacts = contactService.findAll(pageable);

            return ResponseEntity.ok(ApiResponse.success("Contacts retrieved successfully", contacts));

        } catch (Exception e) {
            logger.error("Error retrieving contacts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve contacts"));
        }
    }

    /**
     * GET /api/contact/{id} - Get contact by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> getContactById(@PathVariable String id) {
        logger.debug("Getting contact by ID: {}", id);

        try {
            Optional<Contact> contact = contactService.findById(id);
            
            if (contact.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Contact retrieved successfully", contact.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Contact not found"));
            }

        } catch (Exception e) {
            logger.error("Error retrieving contact with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve contact"));
        }
    }

    /**
     * GET /api/contact/status/{status} - Get contacts by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Contact>>> getContactsByStatus(@PathVariable String status) {
        logger.debug("Getting contacts by status: {}", status);

        try {
            List<Contact> contacts = contactService.findByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Contacts retrieved successfully", contacts));

        } catch (Exception e) {
            logger.error("Error retrieving contacts by status: {}", status, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve contacts"));
        }
    }

    /**
     * GET /api/contact/search - Search contacts
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Contact>>> searchContacts(@RequestParam String q) {
        logger.debug("Searching contacts with query: {}", q);

        try {
            List<Contact> contacts = contactService.searchContacts(q);
            return ResponseEntity.ok(ApiResponse.success("Search completed successfully", contacts));

        } catch (Exception e) {
            logger.error("Error searching contacts with query: {}", q, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search contacts"));
        }
    }

    /**
     * PUT /api/contact/{id}/status - Update contact status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Contact>> updateContactStatus(
            @PathVariable String id,
            @RequestParam String status) {
        
        logger.info("Updating contact status for ID: {} to: {}", id, status);

        try {
            Contact updatedContact = contactService.updateStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Contact status updated successfully", updatedContact));

        } catch (RuntimeException e) {
            logger.warn("Contact not found with ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating contact status for ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update contact status"));
        }
    }

    /**
     * DELETE /api/contact/{id} - Delete contact by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable String id) {
        logger.info("Deleting contact with ID: {}", id);

        try {
            contactService.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Contact deleted successfully", null));

        } catch (Exception e) {
            logger.error("Error deleting contact with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete contact"));
        }
    }

    /**
     * GET /api/contact/statistics - Get contact statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<ContactService.ContactStatistics>> getStatistics() {
        logger.debug("Getting contact statistics");

        try {
            ContactService.ContactStatistics statistics = contactService.getStatistics();
            return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", statistics));

        } catch (Exception e) {
            logger.error("Error retrieving contact statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve statistics"));
        }
    }

    /**
     * GET /api/contact/today - Get contacts created today
     */
    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<Contact>>> getTodayContacts() {
        logger.debug("Getting contacts created today");

        try {
            List<Contact> contacts = contactService.findTodayContacts();
            return ResponseEntity.ok(ApiResponse.success("Today's contacts retrieved successfully", contacts));

        } catch (Exception e) {
            logger.error("Error retrieving today's contacts", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve today's contacts"));
        }
    }

    /**
     * GET /api/contact/email/{email} - Get contacts by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<List<Contact>>> getContactsByEmail(@PathVariable String email) {
        logger.debug("Getting contacts by email: {}", email);

        try {
            List<Contact> contacts = contactService.findByEmail(email);
            return ResponseEntity.ok(ApiResponse.success("Contacts retrieved successfully", contacts));

        } catch (Exception e) {
            logger.error("Error retrieving contacts by email: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve contacts"));
        }
    }

    /**
     * GET /api/contact/farm-type/{farmType} - Get contacts by farm type
     */
    @GetMapping("/farm-type/{farmType}")
    public ResponseEntity<ApiResponse<List<Contact>>> getContactsByFarmType(@PathVariable String farmType) {
        logger.debug("Getting contacts by farm type: {}", farmType);

        try {
            List<Contact> contacts = contactService.findByFarmType(farmType);
            return ResponseEntity.ok(ApiResponse.success("Contacts retrieved successfully", contacts));

        } catch (Exception e) {
            logger.error("Error retrieving contacts by farm type: {}", farmType, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve contacts"));
        }
    }

    /**
     * GET /api/contact/location/{location} - Get contacts by location
     */
    @GetMapping("/location/{location}")
    public ResponseEntity<ApiResponse<List<Contact>>> getContactsByLocation(@PathVariable String location) {
        logger.debug("Getting contacts by location: {}", location);

        try {
            List<Contact> contacts = contactService.findByLocation(location);
            return ResponseEntity.ok(ApiResponse.success("Contacts retrieved successfully", contacts));

        } catch (Exception e) {
            logger.error("Error retrieving contacts by location: {}", location, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve contacts"));
        }
    }

    /**
     * Helper method to get client IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 