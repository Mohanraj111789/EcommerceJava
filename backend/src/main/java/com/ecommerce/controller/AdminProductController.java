package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Product> addProduct(@Valid @RequestBody Product product) {
        Product savedProduct = productService.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product product) {
        Product updatedProduct = productService.update(id, product);
        return ResponseEntity.ok(updatedProduct);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> stockUpdate) {
        Integer newStock = stockUpdate.get("stock");
        if (newStock == null) {
            return ResponseEntity.badRequest().build();
        }
        Product updatedProduct = productService.updateStock(id, newStock);
        return ResponseEntity.ok(updatedProduct);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/offer")
    public ResponseEntity<Product> updateOffer(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> offerUpdate) {
        Integer offerPercentage = offerUpdate.get("offerPercentage");
        if (offerPercentage == null || offerPercentage < 0 || offerPercentage > 100) {
            return ResponseEntity.badRequest().build();
        }
        Product product = productService.getById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setOfferPercentage(offerPercentage);
        Product updatedProduct = productService.save(product);
        return ResponseEntity.ok(updatedProduct);
    }
}
