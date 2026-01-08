import { use, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { SideMenu } from "./SideMenu";
import { CartIcon } from "./CartIcon";


const Navbar = ({ onSearch, products = [] ,cartCount}) => {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userId = user?.id;
  useEffect(() => {
    if (!search && selectedCategory === "All") {
      onSearch("", "All");
    }
  }, [search]);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const handleSearchClick = () => {

    onSearch(search, selectedCategory);
  };
  const Navigate = useNavigate();

  return (
    <header className="amazon-navbar">
      <div className="nav-left">
        <button className="nav-left-button" onClick={() => setOpen(true)}>☰ All</button>
        <SideMenu isOpen={open} onClose={() => setOpen(false)} />
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
          onChange={e => {
            setSelectedCategory(e.target.value)
            onSearch(search, e.target.value);
          }
          }
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
          onKeyDown={e =>{
            if(e.key === "Enter"){
              handleSearchClick();
            }
          }}
        />
        {/*press enter also call the function */}


        <button onClick={handleSearchClick}>🔍</button>
      </div>

      <div className="nav-right">
        <span>Hello, {user ? user.name : "Sign in"}</span>
        {userId && <CartIcon count={cartCount} />}
        <button className="nav-right-button" onClick={() => {


          logout();

        }}>Logout</button>
      </div>

    </header>
  );
};

export default Navbar;
