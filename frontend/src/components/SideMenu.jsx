import "./SideMenu.css";
import { useAuth } from "../contexts/AuthContext";

export function SideMenu({ isOpen, onClose }) {
  const { user } = useAuth();
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      {/* Side Menu */}
      <div className={`side-menu ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="menu-header">
          <span className="user-icon">👤</span>
          <span>Hello, {user ? user.name : 'sign in'}</span>
        </div>

        {/* Digital Content */}
        <div className="menu-section">
          <h4>Digital Content & Devices</h4>
          <p>Prime Video</p>
          <p>Amazon Music</p>
          <p>Kindle E-readers & Books</p>
          <p>Amazon Appstore</p>
        </div>

        {/* Shop by Department */}
        <div className="menu-section">
          <h4>Shop by Department</h4>
          <p>Electronics</p>
          <p>Computers</p>
          <p>Smart Home</p>
          <p>Arts & Crafts</p>
          <p className="see-all">See all ⌄</p>
        </div>

        {/* Programs */}
        <div className="menu-section">
          <h4>Programs & Features</h4>
          <p>Gift Cards</p>
          <p>Shop By Interest</p>
          <p>Amazon Live</p>
          <p>International Shopping</p>
          <p className="see-all">See all ⌄</p>
        </div>

        {/* Help */}
        <div className="menu-section">
          <h4>Help & Settings</h4>
          <p>Your Account</p>
          <p>Customer Service</p>
          <p>Sign Out</p>
        </div>
      </div>
    </>
  );
};

