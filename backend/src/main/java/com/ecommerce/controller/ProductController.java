package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // Public endpoint - anyone can view all products
    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    // Public endpoint - anyone can view a single product
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search products by name or description
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String q) {
        return service.searchProducts(q);
    }

    // Filter products by category
    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return service.getByCategory(category);
    }

    // Filter products by price range
    @GetMapping("/price-range")
    public List<Product> getByPriceRange(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return service.getByPriceRange(minPrice, maxPrice);
    }

    // Get all unique categories
    @GetMapping("/categories")
    public List<String> getAllCategories() {
        return service.getAllCategories();
    }

    // Combined filter endpoint
    @GetMapping("/filter")
    public List<Product> filterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String search) {
        return service.filterProducts(category, minPrice, maxPrice, search);
    }

    // ❌ REMOVED: POST endpoint - only admins can add products via /api/admin/products
}

