import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate("/")}>
        🛒 E-Commerce
      </div>

      <div className="nav-right">
        {user && (
          <span className="greeting">
            Hello, <b>{user.name}</b> 
          </span>
        )}

        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
