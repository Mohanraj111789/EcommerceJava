import React, { useEffect,useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Navbar1 from "../components/Navbar1";
import "./Checkout.css";



export default function Checkout() {

  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth();
  const [products, setProducts] = useState({});
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);

  const userId = user?.id;
  const isBuyNow = location.state?.buyNowProduct;

  useEffect(() => {
    if(userId)
    {
        // If it's a Buy Now checkout, use the passed product
        if (location.state?.buyNowProduct) {
          setBuyNowProduct(location.state.buyNowProduct);
          setBuyNowQuantity(location.state.quantity || 1);
          setLoading(false);
        } else {
          // Regular cart checkout
          loadCart();
        }
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
  const getTotalAmount = () => {
    if (isBuyNow && buyNowProduct) {
      return buyNowProduct.price * buyNowQuantity;
    }
    return cartItems.reduce(
      (sum, item) => sum + item.quantity * (products[item.productId]?.price || 0),
      0
    );
  };

  const totalAmount = getTotalAmount();

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    try {
      // Handle Buy Now checkout
      if (isBuyNow && buyNowProduct) {
        const orderData = {
          userId,
          items: [
            {
              productId: buyNowProduct.id,
              quantity: buyNowQuantity,
              price: buyNowProduct.price
            }
          ],
          address,
          totalAmount
        };

        // Call backend to create order
        await axios.post("http://localhost:8080/api/orders", orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        alert("✅ Order placed successfully!");
        navigate("/orders"); // redirect to orders page
      } else {
        // Handle regular cart checkout
        const orderData = {
          userId,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products[item.productId]?.price
          })),
          address,
          totalAmount
        };

        await axios.post("http://localhost:8080/api/orders", orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        alert("✅ Order placed successfully!");
        navigate("/orders"); // redirect to orders page
      }
    } catch (err) {
      alert("❌ Error placing order: " + err.message);
      console.error("Order error:", err);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar1/>
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

        {isBuyNow && buyNowProduct ? (
          // Buy Now Product Summary
          <div>
            <div className="summary-row">
              <span>{buyNowProduct.name}</span>
              <span>₹{buyNowProduct.price}</span>
            </div>
            <div className="summary-row">
              <label>Quantity:</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  onClick={() => setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))}
                  style={{ padding: '5px 10px' }}
                >
                  -
                </button>
                <span>{buyNowQuantity}</span>
                <button 
                  onClick={() => setBuyNowQuantity(Math.min(buyNowProduct.stock, buyNowQuantity + 1))}
                  style={{ padding: '5px 10px' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Cart Items Summary
          cartItems.map((item) => {
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
          })
        )}

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
          onClick={() => isBuyNow ? navigate("/products") : navigate("/cart")}
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
