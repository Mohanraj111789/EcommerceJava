package com.ecommerce.controller;
import com.ecommerce.service.WalletService;
import com.ecommerce.dto.AddMoneyRequest;
import com.ecommerce.model.User;
import com.ecommerce.model.Wallet;
import com.ecommerce.repository.UserRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/balance")
    public BigDecimal getBalance(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        return walletService.getWalletByUserId(userId).getBalance();
    }
@PostMapping("/add-money")
public ResponseEntity<?> addMoney(
        Authentication auth,
        @RequestBody AddMoneyRequest request
) {
    String email = auth.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
        throw new RuntimeException("Amount must be greater than zero");
    }

    Wallet wallet = walletService.addMoney(user.getId(), request.getAmount());

    return ResponseEntity.ok(wallet);
}

}

