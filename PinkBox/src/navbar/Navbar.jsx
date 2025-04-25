import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home';
import Movies from './Movies';
import Login from './Login';
import Cart from './Cart';
import AboutUs from './AboutUs';
import './navbar.css';
import Checkout from './Checkout';

export default function NavBar() {
  return (
    <div className="navbar-layout">
      {/* Navigation Bar */}
      <nav>
        <div className="left-links">
          <NavLink to="/" exact="true" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? 'active' : ''}>Movies</NavLink>
          <NavLink to="/aboutus" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink>      
        </div>

        <div className="right-links">
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>Cart</NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>User</NavLink>
        </div>
      </nav>

      {/* Routed Pages */}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </div>
  );
}
