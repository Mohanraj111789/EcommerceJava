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

  const { user } = useAuth();
  const userId = user?.id;

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadProducts();
    if (userId) loadCartCount();
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
      const res = await axios.get(`http://localhost:8080/api/cart/${userId}`);
      const count = res.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  const addToCart = async (productId) => {
    if (!userId) return navigate("/login");
    await axios.post(`http://localhost:8080/api/cart/${userId}/add`, {
      productId,
      quantity: 1
    });
    loadCartCount();
  };

  const buyNow = (productId) => {
    if (!userId) return navigate("/login");
    const product = products.find(p => p.id === productId);
    navigate("/checkout", {
      state: { buyNowProduct: product, quantity: 1 }
    });
  };

  /* ================= 🔥 NEW: SEARCH UPDATE ================= */
  const handleSearch = async (searchText, category) => {
    try {
      // Reset to all products if empty
      if (!searchText && category === "All") {
        loadProducts();
        return;
      }
      if(!searchText && category !== "All") {
        const response = await axios.get(`http://localhost:8080/api/products/category/${category}`);
        setProducts(response.data);
        return;
      }
      const response = await axios.get(`http://localhost:8080/api/products/category/${category}`);
      setProducts(response.data);

      const res = await axios.get(
        "http://localhost:8080/api/products/search",
        { params: { q: searchText, category } }
      );

      setProducts(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="products-container">
      {/* 🔥 Navbar now controls search */}
      <Navbar onSearch={handleSearch} products={products} />

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
