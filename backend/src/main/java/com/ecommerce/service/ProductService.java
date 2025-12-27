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
}

