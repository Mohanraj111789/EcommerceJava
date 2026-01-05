import "./NotFound.css";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();
    
  return (
    <div className="notfound-wrapper">
      <div className="notfound-container">

        {/* LEFT CONTENT */}
        <div className="notfound-content">
          <h1>Currently the product is not available</h1>
          <p>
            Please check the product or try again later.
          </p>

          <button className="notfound-btn" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>

        {/* RIGHT DESIGN (NO IMAGE) */}
        <div className="notfound-visual">
          <div className="card">
            <span className="tag">Aw, Snap!</span>
            <h3>404</h3>
            <p>Product Not Found</p>
          </div>

          <div className="floating-circle one"></div>
          <div className="floating-circle two"></div>
          <div className="floating-circle three"></div>
        </div>

      </div>
    </div>
  );
};

