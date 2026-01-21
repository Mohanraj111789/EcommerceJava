package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.ecommerce.dto.OrderProductDTO;

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

    public List<Product> getAllProducts()
    {
        return productRepository.findAll();
    }

    public List<OrderProductDTO> getOrdersWithProducts() {
        return repo.getOrdersWithProducts();
    }
    
    public void updateOrderStatus(Long orderId, String status) {
        int updated = repo.updateOrderStatus(orderId, status);
        if (updated == 0) {
            throw new RuntimeException("Order not found or update failed");
        }
    }


}
