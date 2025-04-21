import React, { useState, useEffect } from 'react';
import './checkout.css';

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Function to get the JWT token from localStorage (or any other storage)
  const getToken = () => {
    return localStorage.getItem('auth-token'); // Assuming the token is saved in localStorage
  };

  useEffect(() => {
    // Fetch user data from backend to get cart info
    const fetchUserData = async () => {
      const token = getToken();
  
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
  
      try {
        const response = await fetch('http://localhost:4000/getcart', {  // Change URL to /getcart
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token, // Send the token in the headers
          },
        });
  
        if (response.ok) {
          const userData = await response.json();
          setCartData(userData); // Now userData will be the cartData object itself
          setIsLoading(false); // Stop loading once data is fetched
        } else {
          console.error('Failed to fetch cart data');
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleSendEmail = async () => {
    const token = getToken();
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    if (cartData) {
      try {
        const response = await fetch('http://localhost:4000/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token, // Include the token in the request headers
          },
          body: JSON.stringify({
            to: 'customer@example.com', // Replace with actual user email
            body: cartData,
          }),
        });

        if (response.ok) {
          setIsEmailSent(true);
        } else {
          console.error('Failed to send email');
        }
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  };

  useEffect(() => {
    // Trigger email sending after cart data is loaded
    if (cartData && !isEmailSent) {
      handleSendEmail();
    }
  }, [cartData, isEmailSent]);

  return (
    <div className="checkout-container">
      {isLoading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="checkout-message">
          <h1>Securely Checked Out!</h1>
          <p>An email has been sent to your inbox for confirmation.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
