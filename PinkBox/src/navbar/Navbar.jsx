import { Routes, Route, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home';
import Movies from './Movies';
import Login from './Login';
import Cart from './Cart';
import AboutUs from './AboutUs';
import Wishlist from './Wishlist';
import Checkout from './Checkout';
import './navbar.css';

export default function NavBar() {
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch the number of items in the cart on initial load or when the cart is updated
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          console.warn("No token found. Please log in.");
          return;
        }

        const cartRes = await fetch('http://localhost:4000/getcart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        const cartData = await cartRes.json();

        if (cartData.success) {
          const cartMap = cartData.cartData;
          const cartItemsCount = Object.values(cartMap).reduce((total, quantity) => total + quantity, 0);
          setCartItemCount(cartItemsCount);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCart();
  }, []);

  return (
    <div className="navbar-layout">
      {/* Navigation Bar */}
      <nav>
        <div className="left-links">
          <NavLink to="/" exact="true" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? 'active' : ''}>Movies</NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'active' : ''}>Wishlist</NavLink>
          <NavLink to="/aboutus" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink>      
        </div>

        <div className="right-links">
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>
            Cart
            {cartItemCount > 0 && (
              <span className="cart-item-count">{cartItemCount}</span>
            )}
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>User</NavLink>
        </div>
      </nav>

      {/* Routed Pages */}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </div>
  );
}