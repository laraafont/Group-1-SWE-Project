import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo">PinkBox</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/wishlist">Wishlist</Link></li>
          <li><Link to="/cart">Cart</Link></li>
        </ul>
      </div>

      <div className="nav-right">
        <div className="account-section">
          <button className="account-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src="/assets/user-icon.png" alt="User Icon" className="user-icon" />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p className="user-email">sander@email.com</p>
              <ul>
                <li><Link to="/profile">Profile Settings</Link></li>
                <li><Link to="/orders">Order History</Link></li>
                <li><Link to="/help">Help Center</Link></li>
                <li className="logout"><button>Sign Out</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;