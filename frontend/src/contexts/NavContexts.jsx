import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useAuth } from './AuthContext';

const NavContext = createContext();
//find the cart count
const CartContext = createContext();


const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  //make Api call and update cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      const res = await authService.getCartCount();
      setCartCount(res.data);
    };
    fetchCartCount();
  }, []);

  const addToCart = async (productId) => {

    const res = await fetch(`http://localhost:8080/api/cart/${userId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'body': JSON.stringify({
          'productId': 1,
          'quantity': 2
        })
      }
    });
    const data = await res.json();
    setCartCount(data);
  };

  return {
    cartCount,
    addToCart
  };
};

export { CartProvider, CartContext };