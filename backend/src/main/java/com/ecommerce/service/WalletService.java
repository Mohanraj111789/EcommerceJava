package com.ecommerce.service;

import org.springframework.stereotype.Service;

import com.ecommerce.model.Wallet;
import com.ecommerce.repository.WalletRepository;
import java.math.BigDecimal;

@Service
public class WalletService {
    private final WalletRepository walletRepository;
    
    public WalletService(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }
     public Wallet createWalletIfNotExists(Long userId)
     {
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            Wallet wallet = new Wallet();
            wallet.setUserId(userId);
            wallet.setBalance(BigDecimal.ZERO);
            return walletRepository.save(wallet);
        });
     }
     public Wallet getWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Wallet not found"));
     }
}
