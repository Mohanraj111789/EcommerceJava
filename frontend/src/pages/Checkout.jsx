import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./Checkout.css";



export default function Checkout() {

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth();
  const [products, setProducts] = useState({});

  const userId = user?.id;

  useEffect(() => {
    if(userId)
    {
        loadCart();
        loadProducts();
    }
    }, [userId]);

    const loadCart = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8080/api/cart/${userId}`);
            
            setCart(res.data);
            setCartItems(res.data.items);
        } catch (err) {
            setError('Error loading cart: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        const res = await axios.get("http://localhost:8080/api/products");
        const map = {};
        res.data.forEach(p => (map[p.id] = p));
        setProducts(map);
    };
    console.log(products)

  // 🔹 Dummy address
  const [address, setAddress] = useState("");

  // 🔹 Calculate total
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * (products[item.productId]?.price || 0),
    0
  );

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    alert("✅ Order placed successfully!\n(This is dummy checkout)");
    navigate("/"); // redirect after order
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      {/* Address Section */}
      <div className="checkout-card">
        <h3>Delivery Address</h3>
        <textarea
          className="checkout-textarea"
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Order Summary */}
      <div className="checkout-card">
        <h3>Order Summary</h3>

        {cartItems.map((item) => {
          const product = products[item.productId];
          if (!product) return null;
          return (
            <div className="summary-row" key={item.id}>
              <span>
                {product.name} × {item.quantity}
              </span>
              <span>₹{product.price * item.quantity}</span>
            </div>
          );
        })}

        <hr />

        <div className="summary-total">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="checkout-actions">
        <button
          className="btn-secondary"
          onClick={() => navigate("/cart")}
        >
          ← Back to Cart
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
