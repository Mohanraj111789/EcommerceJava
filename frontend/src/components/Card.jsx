import React from "react";
import "./Card.css";

const Card = ({ product, onAddToCart, onBuyNow }) => {
  const BASE_URL = `../public/assets/`;
  return (
    <div className="product-card">
      {/*i want to add product image here */}
      <div className="product-image-container">
        <img src= {`../assets/${product.imageUrl}`} className="product-image"></img>
      </div>
      <h4 className="product-name">{product.name}</h4>
      <p className="product-price">₹ {product.price}</p>
      <p className="product-description">{product.description}</p>
      <strong className="product-category">Stock:{product.stock}</strong>

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
