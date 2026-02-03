import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { usePayment } from "../contexts/PaymentContext";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [products, setProducts] = useState({});
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const { setOrderDetails } = usePayment();
  const [address, setAddress] = useState("");
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const userId = user?.id;
  const isBuyNow = location.state?.buyNowProduct;
  const API_URL = "https://ecommercejava-2.onrender.com/api";

  useEffect(() => {
    if (userId) {
      if (location.state?.buyNowProduct) {
        setBuyNowProduct(location.state.buyNowProduct);
        setBuyNowQuantity(location.state.quantity || 1);
        setLoading(false);
      } else {
        loadCart();
      }
      loadProducts();
    }
  }, [userId]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/cart/${userId}`);
      setCart(res.data);
      setCartItems(res.data.items);
    } catch (err) {
      setError("Error loading cart: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    const map = {};
    res.data.forEach((p) => (map[p.id] = p));
    setProducts(map);
  };

  const updateQuantity = async (itemId, productId, newQuantity) => {
    if (newQuantity < 1) return;
    const product = products[productId];
    if (product && newQuantity > product.stock) return;

    try {
      await axios.put(`${API_URL}/cart/${userId}/item/${itemId}`, {
        quantity: newQuantity,
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/${userId}/item/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const getItemPrice = (product) => {
    if (!product) return 0;
    if (product.offerPercentage > 0) {
      return product.price - (product.price * product.offerPercentage) / 100;
    }
    return product.price;
  };

  const getSubTotal = () => {
    if (isBuyNow && buyNowProduct) {
      return getItemPrice(buyNowProduct) * buyNowQuantity;
    }
    return cartItems.reduce((sum, item) => {
      const product = products[item.productId];
      return sum + item.quantity * getItemPrice(product);
    }, 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubTotal();
    return subtotal > 500 ? 0 : 50;
  };

  const getDiscountAmount = () => {
    return (getSubTotal() * discount) / 100;
  };

  const getTotalAmount = () => {
    return getSubTotal() - getDiscountAmount() + getDeliveryFee();
  };

  const applyVoucher = () => {
    // Demo voucher codes
    if (voucher.toUpperCase() === "SAVE10") {
      setDiscount(10);
    } else if (voucher.toUpperCase() === "SAVE20") {
      setDiscount(20);
    } else {
      alert("Invalid voucher code");
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    try {
      const totalPrice = getTotalAmount();

      if (isBuyNow && buyNowProduct) {
        const subTotal = getSubTotal();
        const discountAmount = getDiscountAmount();
        const deliveryFee = getDeliveryFee();

        const orderData = {
          userId,
          address,
          totalPrice,
          productId: buyNowProduct.id,
          isBuyNow: true,
          quantity: buyNowQuantity,
        };

        const response = await axios.post(`${API_URL}/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Store order with purchase type info and price breakdown
        localStorage.setItem("currentOrder", JSON.stringify({
          ...response.data,
          isBuyNow: true,
          productId: buyNowProduct.id,
          quantity: buyNowQuantity,
          userId,
          subTotal,
          discountAmount,
          deliveryFee,
          totalPrice,
        }));
        navigate("/payment");
      } else {
        const subTotal = getSubTotal();
        const discountAmount = getDiscountAmount();
        const deliveryFee = getDeliveryFee();

        const orderData = {
          userId,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products[item.productId]?.price,
          })),
          address,
          totalPrice,
          isBuyNow: false,
        };

        const response = await axios.post(`${API_URL}/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Store order with items for stock reduction and cart clearing
        localStorage.setItem("currentOrder", JSON.stringify({
          ...response.data,
          items: orderData.items,
          userId,
          isBuyNow: false,
          subTotal,
          discountAmount,
          deliveryFee,
          totalPrice,
        }));
        navigate("/payment");
      }
    } catch (err) {
      alert("❌ Error placing order: " + err.message);
      console.error("Order error:", err);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">Loading checkout...</div>
      </div>
    );
  }

  if (!isBuyNow && cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h3>Your cart is empty</h3>
          <button
            className="checkout-continue-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Shopping Cart</h1>

      <div className="checkout-layout">
        {/* Left Section - Cart Items */}
        <div className="checkout-cart-section">
          <div className="checkout-table-container">
            <table className="checkout-table">
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isBuyNow && buyNowProduct ? (
                  <tr>
                    <td>
                      <div className="checkout-product-info">
                        <img
                          src={buyNowProduct.imageUrl || "/placeholder.png"}
                          alt={buyNowProduct.name}
                          className="checkout-product-image"
                        />
                        <div className="checkout-product-details">
                          <h4>{buyNowProduct.name}</h4>
                          <p>Category: {buyNowProduct.category}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="checkout-qty-control">
                        <button
                          className="checkout-qty-btn"
                          onClick={() =>
                            setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))
                          }
                        >
                          −
                        </button>
                        <span className="checkout-qty-value">
                          {buyNowQuantity}
                        </span>
                        <button
                          className="checkout-qty-btn"
                          onClick={() =>
                            setBuyNowQuantity(
                              Math.min(buyNowProduct.stock, buyNowQuantity + 1)
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="checkout-item-total">
                        ₹{Math.round(getItemPrice(buyNowProduct) * buyNowQuantity)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="checkout-delete-btn"
                        onClick={() => navigate("/products")}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item) => {
                    const product = products[item.productId];
                    if (!product) return null;
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="checkout-product-info">
                            <img
                              src={product.imageUrl || "/placeholder.png"}
                              alt={product.name}
                              className="checkout-product-image"
                            />
                            <div className="checkout-product-details">
                              <h4>{product.name}</h4>
                              <p>Category: {product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="checkout-qty-control">
                            <button
                              className="checkout-qty-btn"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                            >
                              −
                            </button>
                            <span className="checkout-qty-value">
                              {item.quantity}
                            </span>
                            <button
                              className="checkout-qty-btn"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className="checkout-item-total">
                            ₹{Math.round(getItemPrice(product) * item.quantity)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="checkout-delete-btn"
                            onClick={() => removeItem(item.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Delivery Address */}
          <div style={{ marginTop: "24px" }}>
            <h4 style={{ marginBottom: "12px", color: "#1a1a1a" }}>
              Delivery Address
            </h4>
            <input
              type="text"
              className="checkout-address-input"
              placeholder="Enter your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button
            className="checkout-update-btn"
            onClick={() => (isBuyNow ? navigate("/products") : navigate("/cart"))}
          >
            {isBuyNow ? "Continue Shopping" : "Update Cart"}
          </button>
        </div>

        {/* Right Section - Order Summary */}
        <div className="checkout-summary-section">
          <div className="checkout-summary-card">
            <h3 className="checkout-summary-title">Order Summary</h3>

            {/* Voucher Input */}
            <div className="checkout-voucher">
              <input
                type="text"
                className="checkout-voucher-input"
                placeholder="Discount voucher"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
              <button className="checkout-voucher-btn" onClick={applyVoucher}>
                Apply
              </button>
            </div>

            {/* Summary Rows */}
            <div className="checkout-summary-rows">
              <div className="checkout-summary-row">
                <span>Sub Total</span>
                <span>₹{Math.round(getSubTotal())} INR</span>
              </div>
              {discount > 0 && (
                <div className="checkout-summary-row checkout-discount">
                  <span>Discount ({discount}%)</span>
                  <span>-₹{Math.round(getDiscountAmount())} INR</span>
                </div>
              )}
              <div className="checkout-summary-row">
                <span>Delivery fee</span>
                <span>
                  {getDeliveryFee() === 0
                    ? "FREE"
                    : `₹${getDeliveryFee()} INR`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="checkout-summary-total">
              <span>Total</span>
              <span className="checkout-total-amount">
                ₹{Math.round(getTotalAmount())} INR
              </span>
            </div>

            {/* Warranty Notice */}
            <div className="checkout-warranty">
              <span className="checkout-warranty-icon">✓</span>
              <span>
                90 Day Limited Warranty against manufacturer's defects.{" "}
                <a href="#" className="checkout-details-link">
                  Details
                </a>
              </span>
            </div>

            {/* Checkout Button */}
            <button className="checkout-now-btn" onClick={handlePlaceOrder}>
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}