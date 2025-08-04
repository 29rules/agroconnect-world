package com.agroconnect;

import com.agroconnect.dto.ContactRequest;
import com.agroconnect.model.Contact;
import com.agroconnect.repository.ContactRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
public class ContactControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        contactRepository.deleteAll();
    }

    @Test
    void testSubmitContact() throws Exception {
        ContactRequest contactRequest = new ContactRequest(
            "John",
            "Doe",
            "john.doe@example.com",
            "+1-555-123-4567",
            "Test Subject",
            "This is a test message for the contact form."
        );

        mockMvc.perform(post("/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Contact form submitted successfully"))
                .andExpect(jsonPath("$.data.firstName").value("John"))
                .andExpect(jsonPath("$.data.lastName").value("Doe"))
                .andExpect(jsonPath("$.data.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.data.status").value("NEW"));
    }

    @Test
    void testSubmitContactWithValidationError() throws Exception {
        ContactRequest contactRequest = new ContactRequest(
            "", // Invalid: empty first name
            "Doe",
            "invalid-email", // Invalid: not a valid email
            "123", // Invalid: too short phone number
            "Test", // Invalid: too short subject
            "Short" // Invalid: too short message
        );

        mockMvc.perform(post("/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorCode").value("VALIDATION_ERROR"));
    }

    @Test
    void testGetAllContacts() throws Exception {
        // First, create a contact
        ContactRequest contactRequest = new ContactRequest(
            "Jane",
            "Smith",
            "jane.smith@example.com",
            "+1-555-987-6543",
            "Another Test",
            "Another test message for the contact form."
        );

        mockMvc.perform(post("/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isCreated());

        // Then, get all contacts
        mockMvc.perform(get("/contact"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content.length()").value(1))
                .andExpect(jsonPath("$.data.content[0].firstName").value("Jane"));
    }

    @Test
    void testGetContactById() throws Exception {
        // First, create a contact
        ContactRequest contactRequest = new ContactRequest(
            "Bob",
            "Johnson",
            "bob.johnson@example.com",
            "+1-555-111-2222",
            "Test for Get by ID",
            "This is a test message for getting contact by ID."
        );

        String response = mockMvc.perform(post("/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract the ID from the response
        String contactId = objectMapper.readTree(response).get("data").get("id").asText();

        // Then, get the contact by ID
        mockMvc.perform(get("/contact/" + contactId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.firstName").value("Bob"))
                .andExpect(jsonPath("$.data.email").value("bob.johnson@example.com"));
    }

    @Test
    void testGetContactByIdNotFound() throws Exception {
        mockMvc.perform(get("/contact/nonexistent-id"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetStatistics() throws Exception {
        // Create a few contacts
        ContactRequest contact1 = new ContactRequest(
            "Alice",
            "Brown",
            "alice.brown@example.com",
            "+1-555-333-4444",
            "Statistics Test 1",
            "First test message for statistics."
        );

        ContactRequest contact2 = new ContactRequest(
            "Charlie",
            "Wilson",
            "charlie.wilson@example.com",
            "+1-555-555-6666",
            "Statistics Test 2",
            "Second test message for statistics."
        );

        mockMvc.perform(post("/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contact1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contact2)))
                .andExpect(status().isCreated());

        // Get statistics
        mockMvc.perform(get("/contact/statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalContacts").value(2))
                .andExpect(jsonPath("$.data.newContacts").value(2));
    }

    @Test
    void testSearchContacts() throws Exception {
        // Create contacts
        ContactRequest contact1 = new ContactRequest(
            "David",
            "Miller",
            "david.miller@example.com",
            "+1-555-777-8888",
            "Search Test",
            "This is a search test message."
        );

        ContactRequest contact2 = new ContactRequest(
            "Eva",
            "Garcia",
            "eva.garcia@example.com",
            "+1-555-999-0000",
            "Another Search Test",
            "Another search test message."
        );

        mockMvc.perform(post("/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contact1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contact2)))
                .andExpect(status().isCreated());

        // Search for "David"
        mockMvc.perform(get("/contact/search?q=David"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].firstName").value("David"));

        // Search for "Search Test"
        mockMvc.perform(get("/contact/search?q=Search Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }
} 