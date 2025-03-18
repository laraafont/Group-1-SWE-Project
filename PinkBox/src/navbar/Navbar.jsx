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
            <nav style={{ display: 'flex', gap: '20px', padding: '10px' }}>
                {/* Adds actual links to navbar */}
                <Link to="/">Home</Link> {/* Default Page */}
                <Link to="/movies">Movies</Link>
                <Link to="/login">Login</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/wishlist">Wishlist</Link>
            </nav>

            {/* Route Definitions */}
            <Routes>
                {/* Links to our .jsx files within navbar */}
                <Route path="/" element={<Home />} /> {/* Default Page */}
                <Route path="/movies" element={<Movies />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
        </div>
    );
}