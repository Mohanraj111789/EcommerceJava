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
      {product.offerPercentage > 0 && (
        <div className="offer-badge">{product.offerPercentage}% OFF</div>
      )}
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
      {product.offerPercentage > 0 ? (
        <>
            <span className="product-price original-price">₹ {product.price}</span>
            <span className="product-price discounted-price">₹ {Math.round(product.price - (product.price * product.offerPercentage / 100))}</span>

        </>
      ) : (
        <p className="product-price">₹ {product.price}</p>
      )}
      <p className="text-overflow">{product.description}</p>
      <strong className="product-category">Stock: {product.stock}</strong>

      <button className="btn buy-btn" onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>

      <button className="btn buy-btn" onClick={() => onBuyNow(product.id)}>
        Buy Now
      </button>
    </div>
  );
};

export default Card;
