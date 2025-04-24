import React, { useState, useEffect } from 'react';
import './checkout.css';


const Checkout = () => {
 const [isLoading, setIsLoading] = useState(true);
 const [cartData, setCartData] = useState(null);
 const [isEmailSent, setIsEmailSent] = useState(false);


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

    // Log the token being sent in the request
    console.log('Sending token in fetch request:', token);

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


   if (cartData) {
     try {
       const response = await fetch('http://localhost:4000/sendEmail', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'auth-token': token,
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
