import { useNavigate } from "react-router-dom";
import "./Navbar1.css";

const Navbar1 = () => {
  const navigate = useNavigate();

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

      {/* NAVIGATION LINKS */}
      <nav className="nav-links">
        <span onClick={() => navigate("/")}>HOME</span>
        <span onClick={() => navigate("/products")}>PRODUCTS</span>
        <span onClick={() => navigate("/orders")}>ORDERS</span>
      </nav>

      {/* USER INFO */}
      <div className="nav-user">
        <span>Hello,</span>
        <strong>Mohanraj S</strong>
      </div>
    </header>
  );
};

export default Navbar1;
