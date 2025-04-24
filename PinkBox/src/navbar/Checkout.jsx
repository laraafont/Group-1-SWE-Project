import React, { useState, useEffect } from 'react';
import './checkout.css';

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // State to store the user's email

  const getToken = () => {
    return localStorage.getItem('auth-token');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();

      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/getUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,  // The token being passed in headers
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCartData(userData.cartData); // Extract just the cartData from the user object
          setUserEmail(userData.email);  // Store the user's email
          console.log("Set user email to:", userData.email);
          setIsLoading(false);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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

    if (cartData && userEmail) {
      console.log(userEmail);
      try {
        const response = await fetch('http://localhost:4000/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
          body: JSON.stringify({
            to: userEmail,
            body: cartData,
          }),
        });
        const result = await response.json();
        console.log("SendEmail result:", result);

        if (response.ok) {
          setIsEmailSent(true);
          console.log("Email successfully sent to:", userEmail);
        } else {
          console.error('Failed to send email');
        }
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  };

  useEffect(() => {
    if (cartData && !isEmailSent && userEmail) {
      handleSendEmail();
    }
  }, [cartData, isEmailSent, userEmail]);  // Include userEmail in the dependencies

  return (
    <div className="checkout-container">
      {isLoading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="checkout-message">
          <h1>Thank you for shopping with us!</h1>
          <p>An email has been sent to your inbox for confirmation.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
