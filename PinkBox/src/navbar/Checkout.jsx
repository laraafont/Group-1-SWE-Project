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


 // Function to clear the cart
 const clearCart = () => {
   setCartData({}); // Set cartData to an empty object
   localStorage.setItem('cartData', JSON.stringify({})); // Clear cart from localStorage if needed
 };


 useEffect(() => {
   const fetchUserData = async () => {
     const token = localStorage.getItem('auth-token');
     if (!token) return;
      try {
       const response = await fetch('http://localhost:4000/getUser', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'auth-token': token,
         },
       });
        if (response.ok) {
         const userData = await response.json();
         setCartData(userData.cartData);
         setUserEmail(userData.email);
         setIsLoading(false);
       }
     } catch (error) {
       console.error("Error fetching user data:", error);
     }
   };
    fetchUserData();
 }, []);
  useEffect(() => {
   const handleSendEmail = async () => {
     const token = localStorage.getItem('auth-token');
     if (!cartData || !userEmail || isEmailSent) return;
      try {
       const moviesRes = await fetch("http://localhost:4000/allmovies");
       const moviesData = await moviesRes.json();
       const movies = moviesData.movies;
        const cartItemsArray = movies
         .filter((movie) => cartData[movie.id] > 0)
         .map((movie) => ({
           title: movie.title,
           price: movie.cost,
           quantity: cartData[movie.id],
           total: movie.cost * cartData[movie.id],
         }));
        const emailRes = await fetch("http://localhost:4000/sendEmail", {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'auth-token': token,
         },
         body: JSON.stringify({
           to: userEmail,
           body: cartItemsArray,
         }),
       });
        if (emailRes.ok) {
         setIsEmailSent(true);
         console.log("Confirmation email sent to", userEmail);
       } else {
         console.error("Failed to send confirmation email");
       }
     } catch (err) {
       console.error("Error sending email:", err);
     }
   };
    handleSendEmail();
 }, [cartData, userEmail, isEmailSent]);


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
