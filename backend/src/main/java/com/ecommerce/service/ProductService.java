package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAll() {
        return repo.findAll();
    }

    public Optional<Product> getById(Long id) {
        return repo.findById(id);
    }

    public Product save(Product product) {
        return repo.save(product);
    }

    // Admin methods
    public Product update(Long id, Product updatedProduct) {
        Product existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        existing.setName(updatedProduct.getName());
        existing.setPrice(updatedProduct.getPrice());
        existing.setStock(updatedProduct.getStock());
        return repo.save(existing);
    }

    public void deleteById(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        repo.deleteById(id);
    }

    public Product updateStock(Long id, int newStock) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setStock(newStock);
        return repo.save(product);
    }

    // Search and filter methods
    public List<Product> searchProducts(String query) {
        return repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public List<Product> getByCategory(String category) {
        return repo.findByCategory(category);
    }

    public List<Product> getByPriceRange(Double minPrice, Double maxPrice) {
        if (minPrice != null && maxPrice != null) {
            return repo.findByPriceBetween(minPrice, maxPrice);
        } else if (minPrice != null) {
            return repo.findByPriceGreaterThanEqual(minPrice);
        } else if (maxPrice != null) {
            return repo.findByPriceLessThanEqual(maxPrice);
        }
        return repo.findAll();
    }

    public List<String> getAllCategories() {
        return repo.findDistinctCategories();
    }

    public List<Product> filterProducts(String category, Double minPrice, Double maxPrice, String search) {
        List<Product> products = repo.findAll();
        
        return products.stream()
                .filter(p -> category == null || category.isEmpty() || p.getCategory().equalsIgnoreCase(category))
                .filter(p -> minPrice == null || p.getPrice() >= minPrice)
                .filter(p -> maxPrice == null || p.getPrice() <= maxPrice)
                .filter(p -> search == null || search.isEmpty() || 
                        p.getName().toLowerCase().contains(search.toLowerCase()) ||
                        p.getDescription().toLowerCase().contains(search.toLowerCase()))
                .toList();
    }

    //stock
}

