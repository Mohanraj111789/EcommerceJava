import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CartIcon from "../components/CartIcon";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const { user } = useAuth(); // ✅ logged-in user
  const userId = user?.id;    // ✅ SAFE access

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadProducts();

    // 🔒 Call cart API ONLY when userId exists
    if (userId) {
      loadCartCount();
    }
  }, [userId]);

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const loadCartCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/cart/${userId}`
      );

      const count = res.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(count);
    } catch (err) {
      console.error("Failed to load cart count", err);
      setCartCount(0);
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      navigate("/login"); // 🔐 not logged in
      return;
    }

    await axios.post(`http://localhost:8080/api/cart/${userId}/add`, {
      productId,
      quantity: 1
    });

    loadCartCount();
  };

  const buyNow = async (productId) => {
    await addToCart(productId);
    navigate("/cart");
  };

  return (
    <div className="products-container">
      <Navbar />
      {userId && <CartIcon count={cartCount} />}

      <h2 className="page-title">Products</h2>

      <div className="products-grid">
        {products.map(product => (
          <Card
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            onBuyNow={buyNow}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
