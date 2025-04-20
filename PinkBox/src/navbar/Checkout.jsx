import React, { useState, useEffect } from 'react';
import './checkout.css';

const Checkout = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('Thank you for your purchase!');
  const [textContent, setTextContent] = useState('Your order has been successfully placed.');

  // Fetch user data to get the logged-in user's email
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:4000/getUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary authorization headers, such as a token
          },
        });
        
        const data = await response.json();
        if (data && data.email) {
          setEmail(data.email);  // Automatically set the email from the backend
        } else {
          alert('No user found. Please log in.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while fetching user data.');
      }
    };

    fetchUser();
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true); // Set loading to true when checkout starts
    try {
      const response = await fetch('http://localhost:4000/sendemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toEmail: email,
          subject: subject,
          textContent: textContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    } finally {
      setIsLoading(false); // Set loading to false when the request finishes
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-message">
        {isLoading ? (
          <div className="loading-spinner"></div> // Loading spinner
        ) : (
          <>
            <h1>Securely Checked Out!</h1>
            <p>Check your email for confirmation and your purchased media.</p>
          </>
        )}
      </div>

      {!isLoading && (
        <div>
          <h2>Checkout</h2>
          {/* Don't show the email input if the email is already fetched */}
          {!email ? (
            <p>Loading your details...</p>
          ) : (
            <button onClick={handleCheckout}>Complete Checkout</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
