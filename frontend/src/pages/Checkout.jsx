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
  const [selectedPayment, setSelectedPayment] = useState("UPI");

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

  const [address, setAddress] = useState("");

  const getTotalAmount = () => {
    if (isBuyNow && buyNowProduct) {
      return buyNowProduct.offerPercentage > 0
        ? buyNowProduct.price -
            (buyNowProduct.price * buyNowProduct.offerPercentage) / 100
        : buyNowProduct.price * buyNowQuantity;
    }
    return cartItems.reduce(
      (sum, item) =>
        sum +
        item.quantity *
          (products[item.productId]?.offerPercentage > 0
            ? products[item.productId]?.price -
              (products[item.productId]?.price *
                products[item.productId]?.offerPercentage) /
                100
            : products[item.productId]?.price || 0),
      0
    );
  };

  const totalPrice = getTotalAmount();

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    try {
      if (isBuyNow && buyNowProduct) {
        const orderData = {
          userId,
          address,
          totalPrice,
          productId: buyNowProduct.id,
        };

        const response = await axios.post(
          `${API_URL}/orders`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        localStorage.setItem("currentOrder", JSON.stringify(response.data));
        navigate("/payment");
      } else {
        const orderData = {
          userId,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products[item.productId]?.price,
          })),
          address,
          totalPrice,
        };

        await axios.post(`${API_URL}/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setOrderDetails(orderData);
        navigate("/payment");
      }
    } catch (err) {
      alert("❌ Error placing order: " + err.message);
      console.error("Order error:", err);
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">Choose Payment Method</h2>

      <div className="payment-layout">
        {/* LEFT: Payment Options */}
        <div className="payment-sidebar">
          {["UPI", "Credit / Debit Card", "EMI", "Net Banking", "Pay with Wallet"].map(
            (method) => (
              <button
                key={method}
                className={`payment-option ${
                  selectedPayment === method ? "active" : ""
                }`}
                onClick={() => setSelectedPayment(method)}
              >
                {method}
              </button>
            )
          )}
        </div>

        {/* CENTER: Payment Details UI */}
        <div className="payment-main">
          {selectedPayment === "UPI" && (
            <div className="payment-card">
              <h3>UPI</h3>
              <p>Pay instantly using your UPI ID</p>
              <input type="text" placeholder="Enter UPI ID" />
              <div className="payment-buttons">
                <button className="btn-light">Verify & Pay</button>
                <button className="btn-dark" onClick={handlePlaceOrder}>
                  Pay Now
                </button>
              </div>
            </div>
          )}

          {selectedPayment === "Credit / Debit Card" && (
            <div className="payment-card">
              <h3>Credit / Debit Card</h3>
              <input type="text" placeholder="Card Number" />
              <div className="row">
                <input type="text" placeholder="MM/YY" />
                <input type="text" placeholder="CVV" />
              </div>
              <button className="btn-light">Proceed to EMI</button>
              <button className="btn-dark" onClick={handlePlaceOrder}>
                Pay Now
              </button>
            </div>
          )}

          {selectedPayment === "EMI" && (
            <div className="payment-card">
              <h3>EMI</h3>
              <select>
                <option>Select EMI Tenure</option>
              </select>
              <button className="btn-light">Proceed to EMI</button>
              <button className="btn-dark" onClick={handlePlaceOrder}>
                Pay Now
              </button>
            </div>
          )}

          {selectedPayment === "Net Banking" && (
            <div className="payment-card">
              <h3>Net Banking</h3>
              <select>
                <option>Select Bank</option>
              </select>
              <button className="btn-dark" onClick={handlePlaceOrder}>
                Pay Now
              </button>
            </div>
          )}

          {selectedPayment === "Pay with Wallet" && (
            <div className="payment-card">
              <h3>Pay with Wallet</h3>
              <select>
                <option>Select your Bank</option>
              </select>
              <button className="btn-dark" onClick={handlePlaceOrder}>
                Pay Now
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Price Details */}
        <div className="price-summary">
          <h3>Price Details</h3>
          <p>MRP: ₹{Math.round(totalPrice + 16000)}</p>
          <p>Discount: +16,000</p>
          <hr />
          <h2>Total: ₹{Math.round(totalPrice)}</h2>
        </div>
      </div>

      {/* Delivery Address (still used by backend) */}
      <div className="address-box">
        <h3>Delivery Address</h3>
        <textarea
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
    </div>
  );
}
