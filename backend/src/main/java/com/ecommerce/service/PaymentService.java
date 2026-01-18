package com.ecommerce.service;
import com.ecommerce.repository.*;
import com.ecommerce.model.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PaymentService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public Transaction transfer(
            Long senderUserId,
            Long receiverUserId,
            BigDecimal amount,
            String idempotencyKey
    ) {

        // 1️⃣ Validate amount
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        // 2️⃣ Idempotency check
        Transaction existing =
                transactionRepository.findByIdempotencyKey(idempotencyKey)
                        .orElse(null);

        if (existing != null) {
            return existing;
        }

        Wallet sender = walletRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        Wallet receiver = walletRepository.findByUserId(receiverUserId)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        // 3️⃣ Lock wallets in fixed order (prevents deadlock)
        Wallet firstLock = sender.getId() < receiver.getId() ? sender : receiver;
        Wallet secondLock = sender.getId() < receiver.getId() ? receiver : sender;

        walletRepository.lockById(firstLock.getId());
        walletRepository.lockById(secondLock.getId());

        // 4️⃣ Balance check
        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // 5️⃣ Update balances
        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        walletRepository.save(sender);
        walletRepository.save(receiver);

        // 6️⃣ Create immutable transaction
        Transaction txn = new Transaction();
        txn.setIdempotencyKey(idempotencyKey);
        txn.setSenderWalletId(sender.getId());
        txn.setReceiverWalletId(receiver.getId());
        txn.setAmount(amount);
        txn.setStatus("SUCCESS");

        return transactionRepository.save(txn);
    }
}

