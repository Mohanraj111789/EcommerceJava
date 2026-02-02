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

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: ""
  });

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
    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please fill all address fields");
      return;
    }

    const fullAddress = `${address.name}, ${address.phone}, ${address.street}, ${address.city} - ${address.pincode}`;

    try {
      if (isBuyNow && buyNowProduct) {
        const orderData = {
          userId,
          address: fullAddress,
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
          address: fullAddress,
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
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>

      <div className="cart-layout">
        {/* LEFT SIDE - CART ITEMS TABLE */}
        <div className="cart-items-box">
          <div className="cart-header">
            <span>Product Code</span>
            <span>Quantity</span>
            <span>Total</span>
            <span>Action</span>
          </div>

          {isBuyNow && buyNowProduct ? (
            <div className="cart-row">
              <div className="product-info">
                <img src={buyNowProduct.image || "/placeholder.png"} alt="product" />
                <div>
                  <h4>{buyNowProduct.name}</h4>
                  <p>Set : Colour : Default</p>
                </div>
              </div>

              <div className="qty-box">
                <button onClick={() => setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))}>
                  -
                </button>
                <span>{buyNowQuantity}</span>
                <button
                  onClick={() =>
                    setBuyNowQuantity(
                      Math.min(buyNowProduct.stock, buyNowQuantity + 1)
                    )
                  }
                >
                  +
                </button>
              </div>

              <span className="price">₹{Math.round(totalPrice)}</span>
              <span className="delete">🗑</span>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <div className="cart-row" key={item.id}>
                  <div className="product-info">
                    <img src={product.image || "/placeholder.png"} alt="product" />
                    <div>
                      <h4>{product.name}</h4>
                      <p>Set : Colour : Default</p>
                    </div>
                  </div>

                  <div className="qty-box">
                    <button>-</button>
                    <span>{item.quantity}</span>
                    <button>+</button>
                  </div>

                  <span className="price">
                    ₹{Math.round(product.price * item.quantity)}
                  </span>
                  <span className="delete">🗑</span>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY + ADDRESS */}
        <div className="summary-box">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Sub Total</span>
            <span>₹{Math.round(totalPrice)}</span>
          </div>

          <div className="summary-row">
            <span>Discount (10%)</span>
            <span>-₹{Math.round(totalPrice * 0.1)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹50</span>
          </div>

          <hr />

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{Math.round(totalPrice * 0.9 + 50)}</span>
          </div>

          {/* ADDRESS COLUMN */}
          <h3 className="address-title">Delivery Address</h3>

          <input
            placeholder="Full Name"
            value={address.name}
            onChange={(e) => setAddress({ ...address, name: e.target.value })}
          />

          <input
            placeholder="Phone Number"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          />

          <input
            placeholder="Street / Flat No"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />

          <input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />

          <input
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
          />

          <button className="checkout-btn" onClick={handlePlaceOrder}>
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );
}
