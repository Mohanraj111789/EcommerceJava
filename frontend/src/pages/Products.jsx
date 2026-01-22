import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import "./Products.css";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState("featured");
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    fetchProducts();
    if (userId) loadCartCount();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setAllProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  /* ================= CART COUNT ================= */
  const loadCartCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/cart/count/${userId}`
      );
      const count = res.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  /* ================= SEARCH + CATEGORY ================= */
  const handleSearch = (searchText, category) => {
    let result = [...allProducts];

    if (category !== "All") {
      result = result.filter(p => p.category === category);
    }

    if (searchText) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(result);
  };

  /* ================= SORTING (FEATURED INCLUDED) ================= */
  const getSortedProducts = () => {
    const sorted = [...filteredProducts];

    if (sortType === "low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "high") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      // featured → latest products first
      sorted.sort((a, b) => b.id - a.id);
    }

    return sorted;
  };

  /* ================= CART ================= */
  const addToCart = async (productId) => {
    if (!userId) return navigate("/login");

    await axios.post(
      `http://localhost:8080/api/cart/${userId}/add`,
      { productId, quantity: 1 }
    );

    loadCartCount();
  };

  const buyNow = (productId) => {
    if (!userId) return navigate("/login");

    const product = allProducts.find(p => p.id === productId);
    if(product.offerPercentage > 0){
        product.price = product.price - (product.price * product.offerPercentage / 100);
    }
    navigate("/checkout", {
      state: { buyNowProduct: product, quantity: 1 }
    });
  };

  return (
    <div className="products-container">
      <Navbar
        onSearch={handleSearch}
        products={allProducts}
        cartCount={cartCount}
      />

      <h2 className="page-title">Products</h2>

      {/* FILTER */}
      <div className="filter-container">
        <select onChange={(e) => setSortType(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      {/* PRODUCTS */}
      <div className="products-grid">
          {getSortedProducts().map(product => (
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
