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
    public void transfer(Long senderUserId, Long receiverUserId, BigDecimal amount) {

        Wallet sender = walletRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        Wallet receiver = walletRepository.findByUserId(receiverUserId)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        // Lock sender wallet
        Wallet lockedSender = walletRepository.lockById(sender.getId());

        if (lockedSender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        lockedSender.setBalance(lockedSender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        walletRepository.save(lockedSender);
        walletRepository.save(receiver);

        Transaction txn = new Transaction();
        txn.setSenderWalletId(sender.getId());
        txn.setReceiverWalletId(receiver.getId());
        txn.setAmount(amount);
        txn.setStatus("SUCCESS");

        transactionRepository.save(txn);
    }
}
