package com.ecommerce.ds;

import com.ecommerce.model.Cart;
import java.util.Stack;

/**
 * Stack implementation for cart undo functionality
 * Allows users to undo their last cart action
 */
public class CartStack {
    
    private Stack<Cart> cartHistory;
    private Cart currentCart;

    public CartStack() {
        this.cartHistory = new Stack<>();
        this.currentCart = new Cart();
    }

    public void addItem(Cart.CartItem item) {
        // Save current state to history
        Cart snapshot = cloneCart(currentCart);
        cartHistory.push(snapshot);
        
        // Add new item
        currentCart.getItems().add(item);
    }

    public void undo() {
        if (!cartHistory.isEmpty()) {
            currentCart = cartHistory.pop();
        }
    }

    public Cart getCurrentCart() {
        return currentCart;
    }

    private Cart cloneCart(Cart original) {
        Cart clone = new Cart();
        clone.setUserId(original.getUserId());
        clone.getItems().addAll(original.getItems());
        return clone;
    }

    public boolean canUndo() {
        return !cartHistory.isEmpty();
    }

    public void clear() {
        cartHistory.clear();
        currentCart = new Cart();
    }
}
