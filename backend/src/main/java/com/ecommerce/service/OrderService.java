package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OrderService {

    private final OrderRepository repo;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository repo, ProductRepository productRepository) {
        this.repo = repo;
        this.productRepository = productRepository;
    }

    public List<Order> getAll() {
        return repo.findAll();
    }

    public Optional<Order> getById(Long id) {
        return repo.findById(id);
    }

    public Order save(Order order) {
        return repo.save(order);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    public List<Order> findByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    // ✅ FILLED METHOD
    public List<Map<String, Object>> getOrderItemsWithProducts(Long orderId) {

        Order order = repo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<Map<String, Object>> response = new ArrayList<>();

        for (OrderItem item : order.getOrderItems()) {

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            Map<String, Object> map = new HashMap<>();
            map.put("orderItemId", item.getId());
            map.put("quantity", item.getQuantity());
            map.put("price", item.getPrice());

            map.put("productId", product.getId());
            map.put("productName", product.getName());
            map.put("productImage", product.getImageUrl());
            map.put("productDescription", product.getDescription());
            map.put("productCategory", product.getCategory());

            response.add(map);
        }

        return response;
    }
}
