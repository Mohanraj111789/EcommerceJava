package com.ecommerce.config;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DbConnectionVerifier {

    private static final Logger log = LoggerFactory.getLogger(DbConnectionVerifier.class);

    @Bean
    public CommandLineRunner verifyDatabaseConnection(
            DataSource dataSource,
            MongoClient mongoClient) {   // <-- Inject Mongo client
        return args -> {

            // =======================
            // 1) VERIFY POSTGRES
            // =======================
            try (Connection conn = dataSource.getConnection()) {
                if (!conn.isClosed()) {
                    System.out.println("===========================================================");
                    System.out.println("[SUCCESS] POSTGRESQL CONNECTION ESTABLISHED");
                    System.out.println("Database Type    : " + conn.getMetaData().getDatabaseProductName());
                    System.out.println("Connection URL   : " + conn.getMetaData().getURL());
                    System.out.println("Username         : " + conn.getMetaData().getUserName());
                    System.out.println("===========================================================");
                }
            } catch (SQLException ex) {
                throw new IllegalStateException(
                        "PostgreSQL connection failed - cannot start application", ex);
            }

            // =======================
            // 2) VERIFY MONGODB
            // =======================
            try {
                MongoDatabase db = mongoClient.getDatabase("EcommerceDB");

                // Simple ping command to check connectivity
                db.runCommand(new org.bson.Document("ping", 1));

                System.out.println("===========================================================");
                System.out.println("[SUCCESS] MONGODB ATLAS CONNECTION ESTABLISHED");
                System.out.println("Database Name : " + db.getName());
                System.out.println("===========================================================");

            } catch (Exception ex) {
                throw new IllegalStateException(
                        "MongoDB connection failed - cannot start application", ex);
            }
        };
    }
}
