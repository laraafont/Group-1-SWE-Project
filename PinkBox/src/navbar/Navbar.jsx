import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home';
import Movies from './Movies';
import Login from './Login';
import Cart from './Cart';
import Wishlist from './Wishlist';
import './navbar.css';


export default function NavBar() {
 return (
   <div className="navbar-layout">
     {/* Navigation Bar */}
     <nav>
       <div className="left-links">
         <NavLink to="/" exact="true" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
         <NavLink to="/movies" className={({ isActive }) => isActive ? 'active' : ''}>Movies</NavLink>
         <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'active' : ''}>Wishlist</NavLink>
       </div>


       <div className="right-links">
         <NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>Cart</NavLink>
         <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
       </div>
     </nav>


     {/* Routed Pages */}
     <div className="page-content">
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/movies" element={<Movies />} />
         <Route path="/wishlist" element={<Wishlist />} />
         <Route path="/login" element={<Login />} />
         <Route path="/cart" element={<Cart />} />
       </Routes>
     </div>
   </div>
 );
}
