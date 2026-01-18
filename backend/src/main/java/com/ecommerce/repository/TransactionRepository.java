package com.ecommerce.repository;
import com.ecommerce.model.Transaction;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction>findByIdempotencyKey(String idempotencyKey);
}
