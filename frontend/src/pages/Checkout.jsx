import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { usePayment } from "../contexts/PaymentContext";

import "./Checkout.css";

export default function Checkout() {

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { setOrderDetails } = usePayment();

  const userId = user?.id;
  const API_URL = "https://ecommercejava-2.onrender.com/api";

  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);

  const [address, setAddress] = useState("");

  const isBuyNow = location.state?.buyNowProduct;

  // -------------------------------
  // LOAD DATA
  // -------------------------------
  useEffect(() => {
    if (!userId) return;

    if (isBuyNow) {
      setBuyNowProduct(location.state.buyNowProduct);
      setBuyNowQuantity(location.state.quantity || 1);
      setLoading(false);
    } else {
      loadCart();
    }

    loadProducts();
  }, [userId]);

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart/${userId}`);
      setCartItems(res.data.items);
    } catch (err) {
      console.error("Cart error", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    const map = {};
    res.data.forEach(p => (map[p.id] = p));
    setProducts(map);
  };

  // -------------------------------
  // PRICE LOGIC
  // -------------------------------
  const getDiscountedPrice = (price, offer) => {
    if (offer > 0) {
      return price - (price * offer) / 100;
    }
    return price;
  };

  const getTotalAmount = () => {

    // BUY NOW
    if (isBuyNow && buyNowProduct) {
      const pricePerItem = getDiscountedPrice(
        buyNowProduct.price,
        buyNowProduct.offerPercentage
      );
      return pricePerItem * buyNowQuantity;
    }

    // CART
    return cartItems.reduce((sum, item) => {
      const product = products[item.productId];
      if (!product) return sum;

      const pricePerItem = getDiscountedPrice(
        product.price,
        product.offerPercentage
      );

      return sum + pricePerItem * item.quantity;
    }, 0);
  };

  const totalPrice = getTotalAmount();

  // -------------------------------
  // PLACE ORDER
  // -------------------------------
  const handlePlaceOrder = async () => {

    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    try {

      // BUY NOW ORDER
      if (isBuyNow && buyNowProduct) {

        const pricePerItem = getDiscountedPrice(
          buyNowProduct.price,
          buyNowProduct.offerPercentage
        );

        const orderData = {
          userId,
          address,
          totalPrice,
          items: [
            {
              productId: buyNowProduct.id,
              quantity: buyNowQuantity,
              price: pricePerItem
            }
          ]
        };

        const res = await axios.post(
          `${API_URL}/orders`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        localStorage.setItem("currentOrder", JSON.stringify(res.data));
        navigate("/payment");
      }

      // CART ORDER
      else {

        const items = cartItems.map(item => {
          const product = products[item.productId];

          return {
            productId: item.productId,
            quantity: item.quantity,
            price: getDiscountedPrice(
              product.price,
              product.offerPercentage
            )
          };
        });

        const orderData = {
          userId,
          address,
          totalPrice,
          items
        };

        await axios.post(
          `${API_URL}/orders`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setOrderDetails(orderData);
        navigate("/payment");
      }

    } catch (err) {
      console.error("Order failed", err);
      alert("❌ Failed to place order");
    }
  };

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  // -------------------------------
  // UI
  // -------------------------------
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

        {isBuyNow && buyNowProduct ? (

          <div>
            <div className="summary-row">
              <span>{buyNowProduct.name}</span>
              <span>
                ₹{Math.round(
                  getDiscountedPrice(
                    buyNowProduct.price,
                    buyNowProduct.offerPercentage
                  ) * buyNowQuantity
                )}
              </span>
            </div>

            <div className="summary-row">
              <label>Quantity</label>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() =>
                    setBuyNowQuantity(q => Math.max(1, q - 1))
                  }
                >
                  -
                </button>

                <span>{buyNowQuantity}</span>

                <button
                  onClick={() =>
                    setBuyNowQuantity(q =>
                      Math.min(buyNowProduct.stock, q + 1)
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>

        ) : (

          cartItems.map(item => {
            const product = products[item.productId];
            if (!product) return null;

            return (
              <div key={item.id} className="summary-row">
                <span>
                  {product.name} × {item.quantity}
                </span>
                <span>
                  ₹{Math.round(
                    getDiscountedPrice(
                      product.price,
                      product.offerPercentage
                    ) * item.quantity
                  )}
                </span>
              </div>
            );
          })

        )}

        <hr />

        <div className="summary-total">
          <span>Total</span>
          <span>₹{Math.round(totalPrice)}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="checkout-actions">

        <button
          className="btn-secondary"
          onClick={() =>
            isBuyNow ? navigate("/products") : navigate("/cart")
          }
        >
          ← {isBuyNow ? "Continue Shopping" : "Back to Cart"}
        </button>

        <button
          className="btn-primary"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>

      </div>

    </div>
  );
}
