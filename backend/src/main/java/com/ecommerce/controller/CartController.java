package com.ecommerce.controller;

import com.ecommerce.model.Cart;
import com.ecommerce.ds.CartStack;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final Map<Long, CartStack> userCarts = new HashMap<>();

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable Long userId) {
        CartStack cartStack = userCarts.computeIfAbsent(userId, k -> new CartStack());
        return cartStack.getCurrentCart();
    }

    @PostMapping("/{userId}/add")
    public Cart addItem(@PathVariable Long userId, @RequestBody Cart.CartItem item) {
        CartStack cartStack = userCarts.computeIfAbsent(userId, k -> new CartStack());
        cartStack.addItem(item);
        return cartStack.getCurrentCart();
    }

    @PostMapping("/{userId}/undo")
    public Cart undoLastAction(@PathVariable Long userId) {
        CartStack cartStack = userCarts.get(userId);
        if (cartStack != null) {
            cartStack.undo();
        }
        return cartStack != null ? cartStack.getCurrentCart() : new Cart();
    }

    @DeleteMapping("/{userId}/clear")
    public void clearCart(@PathVariable Long userId) {
        userCarts.remove(userId);
    }
}
