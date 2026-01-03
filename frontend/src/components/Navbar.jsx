import { use, useState } from "react";
import {useAuth} from "../contexts/AuthContext";
import axios from "axios";
import { useEffect } from "react";

import "./Navbar.css";

const Navbar = () => {
  // Dummy backend-like data
  const [products, setProducts] = useState([]);
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };
  const categories = ["All", ...new Set(products.map((p) => p.category))];
const { user } = useAuth();
//remove the cart for this snippet

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    console.log("Search:", search);
    console.log("Category:", selectedCategory);
    // backend call later
  };

  return (
    <header className="amazon-navbar">
      {/* LEFT */}
      <div className="nav-left">
        <span className="logo">E-Comp</span>
        <span className="logo-dot">.in</span>
      </div>

      {/* LOCATION */}
      <div className="nav-location">
        <span className="small">Deliver to</span>
        <span className="bold">India</span>
      </div>

      {/* SEARCH */}
      <div className="nav-search">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search Amazon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>🔍</button>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <div className="nav-item">
          <span className="small">Hello, {user ? user.name : "sign in"}</span>
          <span className="bold">Account & Lists</span>
        </div>

        <div className="nav-item">
          <span className="small">Returns</span>
          <span className="bold">& Orders</span>
        </div>


      </div>
    </header>
  );
};

export default Navbar;
