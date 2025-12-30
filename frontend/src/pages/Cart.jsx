import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const userId = 9;

  useEffect(() => {
    loadCart();
    loadProducts();
  }, []);

  const loadCart = async () => {
    const res = await axios.get(`http://localhost:8080/api/cart/${userId}`);
    setCart(res.data);
  };

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:8080/api/products");
    const map = {};
    res.data.forEach(p => (map[p.id] = p));
    setProducts(map);
  };

  const updateQty = async (itemId, qty) => {
    await axios.put(`http://localhost:8080/api/cart/${userId}/item/${itemId}`, {
      quantity: qty
    });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await axios.delete(`http://localhost:8080/api/cart/${userId}/item/${itemId}`);
    loadCart();
  };

  const clearCart = async () => {
    await axios.delete(`http://localhost:8080/api/cart/${userId}/clear`);
    loadCart();
  };

  if (!cart || cart.items.length === 0) {
    return <h3 className="empty-cart">🛒 Cart is empty</h3>;
  }

  const total = cart.items.reduce((sum, item) => {
    const price = products[item.productId]?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {cart.items.map(item => {
        const product = products[item.productId];
        if (!product) return null;

        return (
          <div key={item.id} className="cart-item">
            <div>
              <h4>{product.name}</h4>
              <p>₹ {product.price}</p>
            </div>

            <div className="qty-box">
              <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        );
      })}

      <div className="cart-footer">
        <h3>Total: ₹ {total}</h3>
        <button className="clear-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
