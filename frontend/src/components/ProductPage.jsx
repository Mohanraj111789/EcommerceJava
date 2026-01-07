import React from "react";
import "./ProductPage.css";

const ProductPage = () => {
  return (
    <div className="page">
      {/* LEFT IMAGE DUMMY */}
      <div className="left">
        <div className="thumbs">
          <div className="thumb" />
          <div className="thumb" />
          <div className="thumb" />
          <div className="thumb" />
        </div>

        <div className="main-image">
          <div className="image-placeholder">Product Image</div>
        </div>
      </div>

      {/* CENTER DETAILS */}
      <div className="center">
        <h2>Apple iPhone 15 (128 GB) - Blue</h2>

        <p className="rating">★★★★☆ 4.5 (9,803 ratings)</p>

        <div className="price">
          <span className="discount">-22%</span>
          <span className="amount">₹54,790</span>
        </div>

        <p className="mrp">M.R.P.: ₹69,900</p>
        <p className="tax">Inclusive of all taxes</p>

        <div className="section">
          <h4>Colour</h4>
          <div className="options">
            <button className="active">Blue</button>
            <button>Black</button>
            <button>Pink</button>
          </div>
        </div>

        <div className="section">
          <h4>Size</h4>
          <div className="options">
            <button className="active">128 GB</button>
            <button>256 GB</button>
            <button>512 GB</button>
          </div>
        </div>
      </div>

      {/* RIGHT BUY BOX */}
      <div className="right">
        <h3>₹54,790</h3>
        <p className="delivery">FREE delivery in 1–2 days</p>

        <button className="cart">Add to Cart</button>
        <button className="buy">Buy Now</button>

        <p className="secure">🔒 Secure Transaction</p>
      </div>
    </div>
  );
};

export default ProductPage;
