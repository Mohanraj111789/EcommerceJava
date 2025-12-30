import React from "react";
import "./Card.css";

const Card = ({ product, onAddToCart, onBuyNow }) => {
  return (
    <div className="product-card">
      <h4 className="product-name">{product.name}</h4>
      <p className="product-price">₹ {product.price}</p>

      <button
        className="btn add-btn"
        onClick={() => onAddToCart(product.id)}
      >
        Add to Cart
      </button>

      <button
        className="btn buy-btn"
        onClick={() => onBuyNow(product.id)}
      >
        Buy Now
      </button>
    </div>
  );
};

export default Card;
