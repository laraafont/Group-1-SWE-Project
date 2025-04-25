import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);

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
            'auth-token': token,
          },
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
              quantity: cartMap[movie.id] || cartMap[movie._id] || 0,
            }));

          setCartItems(selected);
        } else {
          console.error("Failed to load cart or movies.");
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    fetchCartAndMovies();
  }, []);

  const incrementQuantity = async (movieId) => {
    try {
      const token = localStorage.getItem('auth-token');
      await fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ movieId }),
      });

      setCartItems(prev => prev.map(item =>
        item.id === movieId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const decrementQuantity = async (movieId, currentQty) => {
    try {
      const token = localStorage.getItem('auth-token');
      await fetch('http://localhost:4000/removefromcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ movieId }),
      });

      setCartItems(prev =>
        prev.map(item =>
          item.id === movieId ? { ...item, quantity: item.quantity - 1 } : item
        )
      );

      if (currentQty - 1 === 0) {
        const cartItemElement = document.getElementById(`cart-item-${movieId}`);
        if (cartItemElement) {
          cartItemElement.classList.add('fade-out');
          setTimeout(() => {
            setCartItems(prev => prev.filter(item => item.id !== movieId));
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-scroll-container">
            <div className="cart-list">
              {cartItems.map(item => (
                <div key={item._id} id={`cart-item-${item.id}`} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-image" />
                  <div className="cart-details">
                    <h3>{item.title}</h3>
                    <div className="cart-quantity-controls">
                      <button onClick={() => decrementQuantity(item.id, item.quantity)} disabled={item.quantity <= 0}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => incrementQuantity(item.id)}>+</button>
                    </div>
                    <p>Price: ${item.cost.toFixed(2)}</p>
                    <p>Total: ${(item.cost * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div style={{ height: '60px' }}></div>
            </div>
          </div>

          <div className="cart-summary">
            <p className="cart-total">Total: ${totalPrice.toFixed(2)}</p>
            <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
