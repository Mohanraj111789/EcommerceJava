import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartIcon.css";

const CartIcon = ({ count }) => {
  const navigate = useNavigate();

  return (
    <div className="cart-icon" onClick={() => navigate("/cart")}>
      🛒
      {count > 0 && <span className="cart-badge">{count}</span>}
    </div>
  );
};

export default CartIcon;
