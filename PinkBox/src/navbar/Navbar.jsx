import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home';
import Movies from './Movies';
import Login from './Login';
import Cart from './Cart';
import Wishlist from './Wishlist';

import './navbar.css';

export default function NavBar() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        {/* Left-aligned links */}
        <div className="left-links">
          <NavLink to="/" exact activeClassName="active">Home</NavLink>
          <NavLink to="/movies" activeClassName="active">Movies</NavLink>
          <NavLink to="/wishlist" activeClassName="active">Wishlist</NavLink>
        </div>

        {/* Right-aligned links */}
        <div className="right-links">
          <NavLink to="/cart" activeClassName="active">Cart</NavLink>
          <NavLink to="/login" activeClassName="active">Login</NavLink>
        </div>
      </nav>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  );
}