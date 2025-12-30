import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import CartIcon from "../components/CartIcon";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const userId = 9; // replace later with auth user

  useEffect(() => {
    loadProducts();
    loadCartCount();
  }, []);

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:8080/api/products");
    setProducts(res.data);
  };

  const loadCartCount = async () => {
    const res = await axios.get(`http://localhost:8080/api/cart/${userId}`);
    const count = res.data.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setCartCount(count);
  };

  const addToCart = async (productId) => {
    await axios.post(`http://localhost:8080/api/cart/${userId}/add`, {
      productId,
      quantity: 1
    });
    loadCartCount(); // update cart badge
  };

  const buyNow = async (productId) => {
    await addToCart(productId);
    navigate("/cart");
  };

  return (
    <div className="products-container">
      <CartIcon count={cartCount} />

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
