package com.ecommerce.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    return walletRepository.findByUserId(userId)
        .orElseGet(() -> {

            Wallet wallet = new Wallet();
            wallet.setUserId(userId);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setStatus("ACTIVE");

            return walletRepository.save(wallet);
        });
}

@Transactional
public Wallet addMoney(Long userId, BigDecimal amount) {

    Wallet wallet = walletRepository.findByUserId(userId).get();

    wallet.setBalance(wallet.getBalance().add(amount));

    return walletRepository.save(wallet);
}

}
