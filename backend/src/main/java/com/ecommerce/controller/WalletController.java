package com.ecommerce.controller;
import com.ecommerce.service.WalletService;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;

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
}

