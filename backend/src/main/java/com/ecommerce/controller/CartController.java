package com.ecommerce.controller;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.repository.CartRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Iterator;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final CartRepository cartRepository;

    public CartController(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    /* ================= GET CART ================= */
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUserId(userId);
                    return cartRepository.save(c);
                });

        return ResponseEntity.ok(cart);
    }

    /* ================= ADD ITEM ================= */
    @PostMapping("/{userId}/add")
    public ResponseEntity<Cart> addItem(
            @PathVariable Long userId,
            @RequestBody CartItem reqItem) {

        if (reqItem.getProductId() == null || reqItem.getQuantity() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUserId(userId);
                    return c;
                });

        boolean found = false;

        for (CartItem it : cart.getItems()) {
            if (it.getProductId().equals(reqItem.getProductId())) {
                it.setQuantity(it.getQuantity() + reqItem.getQuantity());
                found = true;
                break;
            }
        }

        if (!found) {
            CartItem newItem = new CartItem();
            newItem.setProductId(reqItem.getProductId());
            newItem.setQuantity(reqItem.getQuantity());
            newItem.setCart(cart);
            cart.getItems().add(newItem);
        }

        Cart saved = cartRepository.save(cart);
        return ResponseEntity.ok(saved);
    }
    //testing API call example:
    //method: POST
    //body:
    //{
    //    "productId": 1,
    //    "quantity": 2
    //}
    //http://localhost:8080/api/cart/1/add

    /* ================= UPDATE QUANTITY ================= */
    @PutMapping("/{userId}/item/{itemId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long userId,
            @PathVariable Long itemId,
            @RequestBody CartItem reqItem) {

        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cart cart = optionalCart.get();
        Iterator<CartItem> iterator = cart.getItems().iterator();
        boolean updated = false;

        while (iterator.hasNext()) {
            CartItem it = iterator.next();
            if (it.getId().equals(itemId)) {

                if (reqItem.getQuantity() <= 0) {
                    iterator.remove(); // SAFE removal
                } else {
                    it.setQuantity(reqItem.getQuantity());
                }
                updated = true;
                break;
            }
        }

        if (!updated) {
            return ResponseEntity.notFound().build();
        }

        Cart saved = cartRepository.save(cart);
        return ResponseEntity.ok(saved);
    }

    /* ================= REMOVE ITEM ================= */
    @DeleteMapping("/{userId}/item/{itemId}")
    public ResponseEntity<Cart> removeItem(
            @PathVariable Long userId,
            @PathVariable Long itemId) {

        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cart cart = optionalCart.get();
        Iterator<CartItem> iterator = cart.getItems().iterator();
        boolean removed = false;

        while (iterator.hasNext()) {
            CartItem it = iterator.next();
            if (it.getId().equals(itemId)) {
                iterator.remove();
                removed = true;
                break;
            }
        }
        
        
        if (!removed) {
            return ResponseEntity.notFound().build();
        }
        
        Cart saved = cartRepository.save(cart);
        return ResponseEntity.ok(saved);
    }
    
    /* ================= CLEAR CART ================= */
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        
        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            cart.getItems().clear();
            cartRepository.save(cart);
        }
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Integer> getCartCount(@PathVariable Long productId) {
        Optional<Cart> optionalCart = cartRepository.findByUserId(productId);
        if (optionalCart.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Cart cart = optionalCart.get();
        return ResponseEntity.ok(cart.getItems().size());
    }
    //testing API call example:
    //http://localhost:8080/api/cart/1

}
