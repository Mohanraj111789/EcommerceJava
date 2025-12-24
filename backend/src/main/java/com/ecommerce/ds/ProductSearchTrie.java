package com.ecommerce.ds;

import java.util.*;

/**
 * Trie data structure for efficient product name search
 * Supports autocomplete functionality
 */
public class ProductSearchTrie {
    
    private class TrieNode {
        Map<Character, TrieNode> children;
        boolean isEndOfWord;
        String productName;

        TrieNode() {
            children = new HashMap<>();
            isEndOfWord = false;
            productName = null;
        }
    }

    private TrieNode root;

    public ProductSearchTrie() {
        root = new TrieNode();
    }

    public void insert(String productName) {
        TrieNode current = root;
        String lowerCase = productName.toLowerCase();

        for (char ch : lowerCase.toCharArray()) {
            current.children.putIfAbsent(ch, new TrieNode());
            current = current.children.get(ch);
        }
        
        current.isEndOfWord = true;
        current.productName = productName;
    }

    public boolean search(String word) {
        TrieNode node = searchNode(word.toLowerCase());
        return node != null && node.isEndOfWord;
    }

    public List<String> autocomplete(String prefix) {
        List<String> results = new ArrayList<>();
        TrieNode node = searchNode(prefix.toLowerCase());
        
        if (node != null) {
            collectAllWords(node, results);
        }
        
        return results;
    }

    private TrieNode searchNode(String word) {
        TrieNode current = root;
        
        for (char ch : word.toCharArray()) {
            if (!current.children.containsKey(ch)) {
                return null;
            }
            current = current.children.get(ch);
        }
        
        return current;
    }

    private void collectAllWords(TrieNode node, List<String> results) {
        if (node.isEndOfWord) {
            results.add(node.productName);
        }
        
        for (TrieNode child : node.children.values()) {
            collectAllWords(child, results);
        }
    }

    public void delete(String word) {
        delete(root, word.toLowerCase(), 0);
    }

    private boolean delete(TrieNode current, String word, int index) {
        if (index == word.length()) {
            if (!current.isEndOfWord) {
                return false;
            }
            current.isEndOfWord = false;
            return current.children.isEmpty();
        }

        char ch = word.charAt(index);
        TrieNode node = current.children.get(ch);
        
        if (node == null) {
            return false;
        }

        boolean shouldDeleteCurrentNode = delete(node, word, index + 1);

        if (shouldDeleteCurrentNode) {
            current.children.remove(ch);
            return current.children.isEmpty();
        }
        
        return false;
    }
}
