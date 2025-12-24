package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.ds.RecommendationHeap;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {

    private final ProductRepository productRepository;
    private final RecommendationHeap recommendationHeap;

    public RecommendationService(ProductRepository productRepository) {
        this.productRepository = productRepository;
        this.recommendationHeap = new RecommendationHeap();
    }

    public List<Product> getRecommendations(int limit) {
        List<Product> allProducts = productRepository.findAll();
        
        // Add products to heap (using price as priority for demo)
        for (Product product : allProducts) {
            recommendationHeap.add(product, product.getPrice());
        }
        
        return recommendationHeap.getTopN(limit);
    }

    public List<Product> getPopularProducts() {
        return productRepository.findAll().stream()
                .limit(10)
                .toList();
    }
}
