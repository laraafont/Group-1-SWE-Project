import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Movies from './Movies';
import Login from './Login';
import Cart from './Cart';
import Wishlist from './Wishlist';

import './navbar.css';

export default function NavBar() {
    return (
        <div>
            {/* Navigation Links */}
            <nav>
                {/* Adds actual links to navbar */}
                <div className="left-links">
                    {/* Left-aligned links */}
                    <Link to="/">Home</Link> {/* Default Page */}
                    <Link to="/movies">Movies</Link>
                    <Link to="/wishlist">Wishlist</Link>
                </div>

                <div className="right-links">                    
                    <Link to="/login">Login</Link>
                    <Link to="/cart">Cart</Link>
                </div>
            </nav>

            {/* Route Definitions */}
            <Routes>
                {/* Links to our .jsx files within navbar */}
                <Route path="/" element={<Home />} /> {/* Default Page */}
                <Route path="/movies" element={<Movies />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </div>
    );
}