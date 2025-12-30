package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByPriceBetween(double minPrice, double maxPrice);
    
    // Search methods
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
    
    // Category filter
    List<Product> findByCategory(String category);
    
    // Price range filters
    List<Product> findByPriceGreaterThanEqual(Double minPrice);
    List<Product> findByPriceLessThanEqual(Double maxPrice);
    
    // Get distinct categories
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category")
    List<String> findDistinctCategories();
}
