import "./ProductDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar1 from "../components/Navbar1";

export default function ProductDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state?.product;

  // Safety check
  if (!product) {
    return (
      <div className="product-details-page-not-found-wrapper">
        <h2 className="product-details-page-not-found-title">
          Product not found
        </h2>
        <button
          className="product-details-page-not-found-button"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-main-page-container">
      <Navbar1 />

      <div className="product-details-content-wrapper">
        {/* LEFT SECTION */}
        <div className="product-details-left-section">
          <div className="product-details-image-box">
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
        </div>

        {/* RIGHT SECTION */}
        <div className="product-details-right-section">
          <span className="product-details-product-tag">
            PRODUCT
          </span>

          <h1 className="product-details-product-title">
            {product.name}
          </h1>

          <div className="product-details-rating-wrapper">
            <span className="product-details-rating-stars">
              ★★★★☆
            </span>
            <span className="product-details-rating-text">
              (4.5 Ratings)
            </span>
          </div>

          <p className="product-details-product-description">
            {product.description}
          </p>

          <div className="product-details-price-stock-wrapper">
            <span className="product-details-product-price">
              ₹ {product.price}
            </span>
            <span className="product-details-stock-badge">
              In Stock
            </span>
          </div>

          <div className="product-details-meta-information-wrapper">
            <div className="product-details-meta-item">
              <strong className="product-details-meta-label">
                Category
              </strong>
              <span className="product-details-meta-value">
                {product.category}
              </span>
            </div>

            <div className="product-details-meta-item">
              <strong className="product-details-meta-label">
                Available
              </strong>
              <span className="product-details-meta-value">
                {product.stock}
              </span>
            </div>
          </div>

          <div className="product-details-action-buttons-wrapper">
            <button className="product-details-add-to-cart-button">
              Add to Cart
            </button>
            <button className="product-details-buy-now-button">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
