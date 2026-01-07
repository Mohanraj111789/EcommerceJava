import { useNavigate } from "react-router-dom";
import { CartIcon } from "./CartIcon";
import { useState, useEffect } from "react";
import "./Navbar1.css";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Navbar1 = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ Correct state hook
  const [cartCount, setCartCount] = useState(0);

  // 🔐 Example userId (replace with AuthContext if you have one)
  const userId = user?.id;

  // ✅ Load cart count
  const loadCartCount = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/cart/${userId}`
      );

      const count = res.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      console.log(count);

      setCartCount(count);
    } catch (error) {
      console.error("Failed to load cart count", error);
      setCartCount(0);
    }
  };

  // ✅ Call API on mount & when userId changes
  useEffect(() => {
    loadCartCount();
  }, [userId]);

  return (
    <header className="navbar">
      {/* LEFT LOGO */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <span className="logo">E-Comp</span>
        <span className="logo-domain">.in</span>
      </div>

      {/* LOCATION */}
      <div className="nav-location">
        <span className="small-text">Deliver to</span>
        <span className="bold-text">India</span>
      </div>

      {/* NAV LINKS */}
      <nav className="nav-links">
        <span onClick={() => navigate("/")}>HOME</span>
        <span onClick={() => navigate("/products")}>PRODUCTS</span>
        <span onClick={() => navigate("/orders")}>ORDERS</span>
      </nav>

      {/* USER */}
      <div className="nav-user">
        <span>Hello,</span>
        <strong>{user.name}</strong>
      </div>

      {/* CART */}
      <CartIcon count={cartCount} />
    </header>
  );
};

export default Navbar1;
