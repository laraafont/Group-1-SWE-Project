import React, { useEffect, useState } from 'react';
import './cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [allMovies, setAllMovies] = useState([]);

  useEffect(() => {
    const fetchCartAndMovies = async () => {
      try {
        const cartRes = await fetch('http://localhost:4000/getcart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const cartData = await cartRes.json();

        const moviesRes = await fetch('http://localhost:4000/allmovies');
        const moviesData = await moviesRes.json();

        if (cartData.success && moviesData.success) {
          const cartMap = cartData.cartData;

          // Get full movie details for items in the cart
          const selected = moviesData.movies
            .filter(movie => cartMap[movie.id] > 0 || cartMap[movie._id] > 0)
            .map(movie => ({
              ...movie,
              quantity: cartMap[movie.id] || cartMap[movie._id] || 0
            }));

          setCartItems(selected);
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
      )}
    </div>
  );
};

export default Cart;
