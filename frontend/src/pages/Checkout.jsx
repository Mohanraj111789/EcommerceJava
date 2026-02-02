import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { usePayment } from "../contexts/PaymentContext";
import Navbar1 from "../components/Navbar1";

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
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const userId = user?.id;
  const isBuyNow = location.state?.buyNowProduct;
  const API_URL = "https://ecommercejava-2.onrender.com/api";

  // Address state
  const [address, setAddress] = useState("");

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

  const updateQty = async (itemId, qty) => {
    if (qty <= 0) return;
    await axios.put(`${API_URL}/cart/${userId}/item/${itemId}`, {
      quantity: qty,
    });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await axios.delete(`${API_URL}/cart/${userId}/item/${itemId}`);
    loadCart();
  };

  const getItemPrice = (product) => {
    if (!product) return 0;
    return product.offerPercentage > 0
      ? product.price - (product.price * product.offerPercentage) / 100
      : product.price;
  };

  const getSubTotal = () => {
    if (isBuyNow && buyNowProduct) {
      return getItemPrice(buyNowProduct) * buyNowQuantity;
    }
    return cartItems.reduce((sum, item) => {
      const product = products[item.productId];
      return sum + getItemPrice(product) * item.quantity;
    }, 0);
  };

  const subTotal = getSubTotal();
  const discount = discountApplied ? subTotal * 0.1 : 0;
  const deliveryFee = 50;
  const totalPrice = subTotal - discount + deliveryFee;

  const applyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "SAVE10") {
      setDiscountApplied(true);
    } else {
      alert("Invalid discount code");
    }
  };

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

        const response = await axios.post(`${API_URL}/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

  if (loading) {
    return (
      <>
        <Navbar1 />
        <div className="checkout-page">
          <div className="checkout-loading">Loading...</div>
        </div>
      </>
    );
  }

  if (!isBuyNow && (!cart || cartItems.length === 0)) {
    return (
      <>
        <Navbar1 />
        <div className="checkout-page">
          <div className="checkout-empty">
            <h3>🛒 Your cart is empty</h3>
            <button
              className="checkout-continue-btn"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar1 />
      <div className="checkout-page">
        <h1 className="checkout-title">Shopping Cart</h1>

        <div className="checkout-layout">
          {/* Left Column - Cart Items Table */}
          <div className="checkout-cart-section">
            <div className="checkout-table-container">
              <table className="checkout-table">
                <thead>
                  <tr>
                    <th>Product Code</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {isBuyNow && buyNowProduct ? (
                    <tr>
                      <td>
                        <div className="checkout-product-info">
                          <img
                            src={`../assets/${buyNowProduct.imageUrl}`}
                            alt={buyNowProduct.name}
                            className="checkout-product-image"
                          />
                          <div className="checkout-product-details">
                            <h4>{buyNowProduct.name}</h4>
                            <p>Set : Colour: {buyNowProduct.category || "Default"}</p>
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
                          <span className="checkout-qty-value">{buyNowQuantity}</span>
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
                      <td className="checkout-item-total">
                        ${Math.round(getItemPrice(buyNowProduct) * buyNowQuantity)}
                      </td>
                      <td>
                        <button
                          className="checkout-delete-btn"
                          onClick={() => navigate("/products")}
                        >
                          🗑
                        </button>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="checkout-address-input"
                          placeholder="Enter address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
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
                                src={`../assets/${product.imageUrl}`}
                                alt={product.name}
                                className="checkout-product-image"
                              />
                              <div className="checkout-product-details">
                                <h4>{product.name}</h4>
                                <p>Set : Colour: {product.category || "Default"}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="checkout-qty-control">
                              <button
                                className="checkout-qty-btn"
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                              >
                                −
                              </button>
                              <span className="checkout-qty-value">{item.quantity}</span>
                              <button
                                className="checkout-qty-btn"
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="checkout-item-total">
                            ${Math.round(getItemPrice(product) * item.quantity)}
                          </td>
                          <td>
                            <button
                              className="checkout-delete-btn"
                              onClick={() => removeItem(item.id)}
                            >
                              🗑
                            </button>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="checkout-address-input"
                              placeholder="Enter address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <button className="checkout-update-btn" onClick={loadCart}>
              Update Cart
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-summary-section">
            <div className="checkout-summary-card">
              <h3 className="checkout-summary-title">Order Summery</h3>

              <div className="checkout-voucher">
                <input
                  type="text"
                  placeholder="Discount voucher"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="checkout-voucher-input"
                />
                <button className="checkout-voucher-btn" onClick={applyDiscount}>
                  Apply
                </button>
              </div>

              <div className="checkout-summary-rows">
                <div className="checkout-summary-row">
                  <span>Sub Total</span>
                  <span>{subTotal.toFixed(2)} USD</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Discount (10%)</span>
                  <span className="checkout-discount">-{discount.toFixed(2)} USD</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Delivery fee</span>
                  <span>{deliveryFee.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <span className="checkout-total-amount">${totalPrice.toFixed(2)} USD</span>
              </div>

              <div className="checkout-warranty">
                <span className="checkout-warranty-icon">✓</span>
                <span>
                  90 Day Limited Warranty against manufacturer's defects{" "}
                  <a href="#" className="checkout-details-link">
                    Details
                  </a>
                </span>
              </div>

              <button className="checkout-now-btn" onClick={handlePlaceOrder}>
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}