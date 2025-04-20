import React, { useState, useEffect } from 'react';
import './checkout.css';

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the time as needed
    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  return (
    <div className="checkout-container">
      <div className="checkout-message">
        {isLoading ? (
          <div className="loading-spinner"></div> // Loading spinner
        ) : (
          <>
            <h1>Securely Checked Out!</h1>
            <p>Check your inbox for confirmation and your purchased media.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
