import "./ProductDetails.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar1 from "../components/Navbar1";

export default function ProductDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const product = state?.product;

  // 🔐 Safety check (refresh / direct URL access)
  if (!product) {
    return (
      <div className="product-page">
        <h2>Product not found</h2>
        <button className="btn" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-page">
        <Navbar1/>
      <div className="product-card">

        {/* LEFT – IMAGE */}
        <div className="product-images">
          <div className="main-image">
            <img
              src={`/assets/${product.imageUrl}`}
              alt={product.name}
            />
          </div>
        </div>

        {/* RIGHT – INFO */}
        <div className="product-info">
          <span className="product-tag">PRODUCT</span>
          <h1 className="product-title">{product.name}</h1>

          <div className="rating">
            <span className="stars">★★★★☆</span>
            <span className="rating-text">(4.5 Ratings)</span>
          </div>

          <p className="description">{product.description}</p>

          <div className="price-section">
            <span className="price">₹ {product.price}</span>
            <span className="badge">In Stock</span>
          </div>

          <div className="details">
            <div>
              <strong>Category</strong>
              <span>{product.category}</span>
            </div>
            <div>
              <strong>Available</strong>
              <span>{product.stock}</span>
            </div>
          </div>

          <div className="actions">
            <button className="btn cart">Add to Cart</button>
            <button className="btn buy">Buy Now</button>
          </div>
        </div>

      </div>
    </div>
  );
}
