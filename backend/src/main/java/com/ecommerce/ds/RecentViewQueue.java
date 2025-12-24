package com.ecommerce.ds;

import com.ecommerce.model.Product;
import java.util.LinkedList;
import java.util.Queue;

/**
 * Queue implementation for tracking recently viewed products
 * FIFO - First In First Out
 */
public class RecentViewQueue {
    
    private Queue<Product> recentlyViewed;
    private final int MAX_SIZE = 10;

    public RecentViewQueue() {
        this.recentlyViewed = new LinkedList<>();
    }

    public void addProduct(Product product) {
        // If queue is full, remove oldest
        if (recentlyViewed.size() >= MAX_SIZE) {
            recentlyViewed.poll(); // Remove first element
        }
        recentlyViewed.offer(product); // Add to end
    }

    public Queue<Product> getRecentlyViewed() {
        return new LinkedList<>(recentlyViewed);
    }

    public void clear() {
        recentlyViewed.clear();
    }

    public int size() {
        return recentlyViewed.size();
    }

    public boolean isEmpty() {
        return recentlyViewed.isEmpty();
    }
}
