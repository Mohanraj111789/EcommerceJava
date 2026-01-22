import React from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";

const Card = ({ product, onAddToCart, onBuyNow }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="product-card">
      <div className="offer-badge">{product.offerPercentage}% OFF</div>
      <div className="product-image-container" onClick={handleClick}>
        <img
          src={
            product.imageUrl
              ? `/assets/${product.imageUrl}`
              : `/assets/product.jpg`
          }
          className="product-image"
          alt={product.name}
        />
      </div>

      <h4 className="product-name">{product.name}</h4>
      <p className="product-price">₹ {product.price}</p>
      <p className="text-overflow">{product.description}</p>
      <strong className="product-category">Stock: {product.stock}</strong>

      <button className="btn add-btn" onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>

      <button className="btn buy-btn" onClick={() => onBuyNow(product.id)}>
        Buy Now
      </button>
    </div>
  );
};

export default Card;
