import { use, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";
import { useEffect } from "react"; 

const Navbar = ({ onSearch, products = [] }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  useEffect(() => {
    if(!search){
      onSearch("", "All");
    }
  }, [search]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const handleSearchClick = () => {

    onSearch(search, selectedCategory);
  };

  return (
    <header className="amazon-navbar">
      <div className="nav-left">
        <span className="logo">E-Comp</span>
        <span className="logo-dot">.in</span>
      </div>

      <div className="nav-location">
        <span className="small">Deliver to</span>
        <span className="bold">India</span>
      </div>

      <div className="nav-search">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button onClick={handleSearchClick}>🔍</button>
      </div>

      <div className="nav-right">
        <span>Hello, {user ? user.name : "Sign in"}</span>
      </div>
    </header>
  );
};

export default Navbar;
