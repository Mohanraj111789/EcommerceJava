package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public List<Order> getAllOrders() {
        return repo.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return repo.findById(id);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    public Order createOrder(Order order) {
        return repo.save(order);
    }
}
