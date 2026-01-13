package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.ProductService;
import com.ecommerce.dto.OrderProductDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService;

    public OrderController(OrderService orderService,ProductService productService) {
        this.orderService = orderService;
        this.productService = productService;
    }
    

    // ✅ Get all orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAll();
    }

    // ✅ Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getById(id);
        return order.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Create order
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.save(order);
    }

    // ✅ Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // // ✅ Get orders by user ID
    // @GetMapping("/user/{userId}")
    // public List<Object> getOrdersByUserId(@PathVariable Long userId) {
    //     List<Order> OrderInUser = orderService.findByUserId(userId);
    //     List<Object> product = new ArrayList<>();
    //     List<Product> AllProducts = productService.findByProductId(7);

    // }

    // ✅ Get order items with product detai

     @GetMapping("/user/{userId}/products")
    public List<Product> getAllProductsOrderedByUser(@PathVariable Long userId) {

        // 1️⃣ Get all products
        List<Product> allProducts = productService.getAll();

        // 2️⃣ Get user orders
        List<Order> userOrders = orderService.findByUserId(userId);

        // 3️⃣ Extract productIds from order items
        List<Long> orderedProductIds = new ArrayList<>();

        for (Order order : userOrders) {
            for(Product product:allProducts)
            {
                if(order.getProductId() == product.getId())
                    orderedProductIds.add(product.getId());
            }
        }

        // 4️⃣ Filter products
        List<Product> filteredProducts = new ArrayList<>();

        for (Product product : allProducts) {
            if (orderedProductIds.contains(product.getId())) {
                filteredProducts.add(product);
            }
        }

        return filteredProducts;
    }
    
    @GetMapping("/user/{userId}/orders")
    public List<OrderProductDTO> getOrdersWithProducts(@PathVariable Long userId) {
        return orderService.getOrdersWithProducts();
    }
}