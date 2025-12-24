package com.ecommerce.ds;

import com.ecommerce.model.Product;
import java.util.*;

/**
 * Min-Heap implementation for product recommendations
 * Maintains top N products based on priority (price, popularity, etc.)
 */
public class RecommendationHeap {
    
    private class ProductNode implements Comparable<ProductNode> {
        Product product;
        double priority;

        ProductNode(Product product, double priority) {
            this.product = product;
            this.priority = priority;
        }

        @Override
        public int compareTo(ProductNode other) {
            return Double.compare(other.priority, this.priority); // Max heap
        }
    }

    private PriorityQueue<ProductNode> heap;

    public RecommendationHeap() {
        this.heap = new PriorityQueue<>();
    }

    public void add(Product product, double priority) {
        heap.offer(new ProductNode(product, priority));
    }

    public List<Product> getTopN(int n) {
        List<Product> topProducts = new ArrayList<>();
        PriorityQueue<ProductNode> tempHeap = new PriorityQueue<>(heap);
        
        int count = Math.min(n, tempHeap.size());
        for (int i = 0; i < count; i++) {
            ProductNode node = tempHeap.poll();
            if (node != null) {
                topProducts.add(node.product);
            }
        }
        
        return topProducts;
    }

    public Product getTop() {
        ProductNode node = heap.peek();
        return node != null ? node.product : null;
    }

    public void clear() {
        heap.clear();
    }

    public int size() {
        return heap.size();
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }

    public void remove(Product product) {
        heap.removeIf(node -> node.product.getId().equals(product.getId()));
    }
}
