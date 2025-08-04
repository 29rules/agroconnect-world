package com.agroconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * Main Spring Boot application class for AgroConnect World API
 * 
 * @author AgroConnect Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableMongoAuditing
public class AgroConnectWorldApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgroConnectWorldApplication.class, args);
    }
} 