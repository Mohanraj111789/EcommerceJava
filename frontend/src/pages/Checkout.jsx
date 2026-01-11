import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const userId = user?.id;
  const isBuyNow = Boolean(location.state?.buyNowProduct);

  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    if (!userId) return;

    loadProducts();

    if (isBuyNow) {
      setBuyNowProduct(location.state.buyNowProduct);
      setBuyNowQuantity(location.state.quantity || 1);
      setLoading(false);
    } else {
      loadCart();
    }
  }, [userId]);

  const loadCart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/cart/count/${userId}`
      );

      // IMPORTANT: copy quantities to local state
      setCartItems(
        res.data.items.map((item) => ({
          ...item,
          quantity: item.quantity, // local quantity
        }))
      );
    } catch (err) {
      console.error("Cart load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:8080/api/products");
    const map = {};
    res.data.forEach((p) => (map[p.id] = p));
    setProducts(map);
  };

  /* ---------------- FRONTEND-ONLY QUANTITY UPDATE ---------------- */

  const increaseQty = (productId, stock) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(stock, item.quantity + 1),
            }
          : item
      )
    );
  };

  const decreaseQty = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  /* ---------------- TOTAL ---------------- */

  const totalPrice = isBuyNow
    ? buyNowProduct?.price * buyNowQuantity
    : cartItems.reduce(
        (sum, item) =>
          sum +
          item.quantity * (products[item.productId]?.price || 0),
        0
      );

  /* ---------------- PLACE ORDER ---------------- */

  const handlePlaceOrder = async() => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }
    const res = await axios.post("http://localhost:8080/api/orders", {
      userId,
      status: "pending",
      address,
      totalPrice,
      productId: isBuyNow ? buyNowProduct.id : cartItems.map(item => item.productId)
      
    });
    if (res.status === 201) {
      alert("Order placed successfully");
    }
    //body



    navigate("/orders");
  };

  if (loading) return <h3>Loading checkout...</h3>;

  /* ---------------- UI ---------------- */

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      {/* ADDRESS */}
      <div className="checkout-card">
        <h3>Delivery Address</h3>
        <textarea
          className="checkout-textarea"
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* ORDER SUMMARY */}
      <div className="checkout-card">
        <h3>Order Summary</h3>

        {/* BUY NOW */}
        {isBuyNow && buyNowProduct && (
          <div className="order-row">
            <div className="order-product-name">
              {buyNowProduct.name}
            </div>

            <div className="order-qty">
              <button
                className="qty-btn"
                onClick={() =>
                  setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))
                }
              >
                −
              </button>

              <span className="qty-value">{buyNowQuantity}</span>

              <button
                className="qty-btn"
                onClick={() =>
                  setBuyNowQuantity(
                    Math.min(buyNowProduct.stock, buyNowQuantity + 1)
                  )
                }
              >
                +
              </button>
            </div>

            <div className="order-price">
              ₹{(buyNowProduct.price * buyNowQuantity).toFixed(2)}
            </div>
          </div>
        )}

        {/* CART ITEMS */}
        {!isBuyNow &&
          cartItems.map((item) => {
            const product = products[item.productId];
            if (!product) return null;

            return (
              <div className="order-row" key={item.id}>
                <div className="order-product-name">
                  {product.name} (₹{product.price})
                </div>

                <div className="order-qty">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      decreaseQty(item.productId)
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
                      increaseQty(
                        item.productId,
                        product.stock
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <div className="order-price">
                  ₹{(product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}

        <hr />

        <div className="summary-total">
          <span>Total</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="checkout-actions">
        <button
          className="btn-secondary"
          onClick={() =>
            navigate(isBuyNow ? "/products" : "/cart")
          }
        >
          ← {isBuyNow ? "Continue Shopping" : "Back to Cart"}
        </button>

        <button className="btn-primary" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}
