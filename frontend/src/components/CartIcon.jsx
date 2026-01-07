import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartIcon.css";

export function CartIcon({ count }) {
  const navigate = useNavigate();
  console.log(count);

  return (
    <div className="cart-icon" onClick={() => navigate("/cart")}>
      🛒
      {count > 0 && <span className="cart-badge">{count}</span>}
    </div>
  );
};

