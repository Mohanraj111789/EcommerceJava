package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.ecommerce.model.*;

@Service
public class OrderService {
    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
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
    
}
