import { useNavigate } from "react-router-dom";
import { CartIcon } from "./CartIcon";
import "./Navbar1.css";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/NavContexts";

const Navbar1 = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

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
