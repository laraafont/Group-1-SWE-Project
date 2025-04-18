import React, { useEffect, useState } from 'react';
import './cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [allMovies, setAllMovies] = useState([]);

  useEffect(() => {
    const fetchCartAndMovies = async () => {
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
            'auth-token': token
          }
        });

        const cartData = await cartRes.json();
        const moviesRes = await fetch('http://localhost:4000/allmovies');
        const moviesData = await moviesRes.json();

        if (cartData.success && moviesData.success) {
          const cartMap = cartData.cartData;

          const selected = moviesData.movies
            .filter(movie => cartMap[movie.id] > 0 || cartMap[movie._id] > 0)
            .map(movie => ({
              ...movie,
              quantity: cartMap[movie.id] || cartMap[movie._id] || 0
            }));

          setCartItems(selected);
        } else {
          console.error("Failed to load cart or movies:", cartData, moviesData);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    fetchCartAndMovies();
  }, []);

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-scroll-container">
          <div className="cart-list">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-image" />
                <div className="cart-details">
                  <h3>{item.title}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.cost}</p>
                  <p>Total: ${item.cost * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

