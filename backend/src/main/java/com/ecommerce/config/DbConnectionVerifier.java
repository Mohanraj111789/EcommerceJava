package com.ecommerce.config;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class to verify database connection on application startup.
 * This provides explicit confirmation that the database connection is established successfully.
 */
@Configuration
public class DbConnectionVerifier {

    private static final Logger log = LoggerFactory.getLogger(DbConnectionVerifier.class);

    /**
     * CommandLineRunner bean that executes after Spring Boot application startup.
     * Attempts to obtain a connection from the DataSource and logs the result.
     * 
     * @param dataSource The auto-configured DataSource bean from application.properties
     * @return CommandLineRunner that verifies the database connection
     */
    @Bean
    public CommandLineRunner verifyDatabaseConnection(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection()) {
                if (!conn.isClosed()) {
                    String url = conn.getMetaData().getURL();
                    String username = conn.getMetaData().getUserName();
                    String databaseProductName = conn.getMetaData().getDatabaseProductName();
                    String databaseProductVersion = conn.getMetaData().getDatabaseProductVersion();
                    
                    System.out.println("===========================================================");
                    System.out.println("[SUCCESS] DATABASE CONNECTION ESTABLISHED SUCCESSFULLY");
                    System.out.println("===========================================================");
                    System.out.println("Database Type    : " + databaseProductName);
                    System.out.println("Database Version : " + databaseProductVersion);
                    System.out.println("Connection URL   : " + url);
                    System.out.println("Username         : " + username);
                    System.out.println("===========================================================");
                    
                } else {
                    System.out.println("[WARNING] Connection obtained but appears to be closed");
                }
            } catch (SQLException ex) {
                System.out.println("===========================================================");
                System.out.println("[ERROR] UNABLE TO ESTABLISH DATABASE CONNECTION");
                System.out.println("===========================================================");
                System.out.println("Error Message: " + ex.getMessage());
                System.out.println("SQL State    : " + ex.getSQLState());
                System.out.println("Error Code   : " + ex.getErrorCode());
                System.out.println("===========================================================");
                
                // Re-throw to prevent application from starting with a broken database connection
                throw new IllegalStateException("Database connection failed - cannot start application", ex);
            }
        };
    }
}
