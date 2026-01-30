import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create Cart Context
const CartContext = createContext();

/**
 * CartProvider Component
 * Manages global cart state including cart count and add to cart functionality
 * 
 * Features:
 * - Fetches and maintains cart count
 * - Provides addToCart method to add products
 * - Automatically updates cart count after operations
 */
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const API_URL = "https://ecommercejava-2.onrender.com/api"

  /**
   * Fetch cart count from backend
   * Gets the total number of items in user's cart
   */
  const getCartCount = async () => {
    if (!userId) {
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/cart/count/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      
      // Calculate total count from all items
      const totalCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
      
      return totalCount;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add product to cart
   * @param {number} productId - ID of the product to add
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Promise<boolean>} - Success status
   */
  const addToCart = async (productId, quantity = 1) => {
    if (!userId) {
      console.error('User not logged in');
      return false;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/cart/${userId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();
      
      // Update cart count after successful addition
      await getCartCount();
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh cart count
   * Useful after cart operations from other components
   */
  const refreshCartCount = async () => {
    await getCartCount();
  };

  // Load cart count when user changes
  useEffect(() => {
    if (userId) {
      getCartCount();
    } else {
      setCartCount(0);
    }
  }, [userId]);

  const value = {
    cartCount,
    loading,
    addToCart,
    getCartCount,
    refreshCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to use Cart Context
 * @returns {Object} Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };