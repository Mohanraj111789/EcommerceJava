package com.ecommerce.repository;

import com.ecommerce.dto.OrderProductDTO;
import com.ecommerce.model.Order;
import com.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long>{
    List<Order> findByUserId(Long userId);
    //implent the join of order table and product table
    List<Product> findByProductId(Long ProductId);

   @Query("""
        SELECT new com.ecommerce.dto.OrderProductDTO(
            o.id,
            o.userId,
            o.status,
            o.totalPrice,
            p.id,
            p.name,
            p.price,
            p.imageUrl
        )
        FROM Order o
        JOIN Product p ON o.productId = p.id
    """)
    List<OrderProductDTO> getOrdersWithProducts();
    



}
