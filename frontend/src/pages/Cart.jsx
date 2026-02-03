import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Cart.css";
import Navbar1 from "../components/Navbar1";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?.id;
  const API_URL = "https://ecommercejava-2.onrender.com/api";

  useEffect(() => {
    if (userId) {
      loadCart();
      loadProducts();
    }
  }, [userId]);

  const loadCart = async () => {
    const res = await axios.get(`${API_URL}/cart/count/${userId}`);
    setCart(res.data === 0 ? 0 : res.data);
  };

  const loadProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    const map = {};
    res.data.forEach(p => (map[p.id] = p));
    setProducts(map);
  };

  const updateQty = async (itemId, qty) => {
    if (qty <= 0) return;
    await axios.put(`${API_URL}/cart/${userId}/item/${itemId}`, {
      quantity: qty
    });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await axios.delete(`${API_URL}/cart/${userId}/item/${itemId}`);
    loadCart();
  };

  const clearCart = async () => {
    await axios.delete(`${API_URL}/cart/${userId}/clear`);
    loadCart();
  };

  const buyNow = (productId) => {
    const product = products[productId];
    const cartItem = cart.items.find(i => i.productId === productId);

    navigate("/checkout", {
      state: {
        buyNowProduct: product,
        quantity: cartItem?.quantity || 1
      }
    });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar1 />
        <div className="cart-page empty-cart">
          <h3>🛒 Your cart is empty</h3>
          <button
            className="continue-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  const total = cart.items.reduce((sum, item) => {
    const price = products[item.productId]?.offerPercentage > 0 ? products[item.productId]?.price - (products[item.productId]?.price * products[item.productId]?.offerPercentage / 100) : products[item.productId]?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      <Navbar1 />

      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">SHOPPING CART</h1>

          <div className="cart-items-grid">
            {cart.items.map(item => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <div key={item.id} className="cart-card">
                  <div className="product-image-container">
                    <img
                      src={`../assets/${product.imageUrl}`}
                      className="product-image"
                      alt={product.name}
                    />
                  </div>

                  <div className="product-details">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-price">₹ {Math.round(product.offerPercentage > 0 ? product.price - (product.price * product.offerPercentage / 100) : product.price)}</p>
                  </div>

                  <div className="qty-control">
                    <span className="qty-label">Qty:</span>
                    <div className="qty-box">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQty(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="qty-value">
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQty(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="delete-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑
                    </button>

                    <button
                      className="buy-now-btn"
                      onClick={() => buyNow(item.productId)}
                    >
                      Buy this now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-footer">
            <h2 className="total-text">Total : ₹{Math.round(total)}</h2>

            <div className="cart-actions">
              <button className="clear-btn" onClick={clearCart}>
                Clear Cart
              </button>

              <button
                className="continue-btn"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
