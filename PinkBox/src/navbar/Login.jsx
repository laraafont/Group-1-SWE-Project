import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';


export default function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const navigate = useNavigate();


 const handleSubmit = async (e) => {
   e.preventDefault();


   if (!email || !password) {
     setError("Please fill in both fields");
     return;
   }


   try {
     const response = await fetch("http://localhost:4000/login", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, password }),
     });


     let data = {};
     try {
       data = await response.json();
     } catch {
       setError("Failed to parse response data");
       return;
     }


     if (!response.ok) {
       throw new Error(data.errors || "Invalid email or password");
     }


     console.log("Login successful:", data);
     localStorage.setItem("auth-token", data.token);
     setError("");
     navigate("/");
   } catch (error) {
     setError(error.message);
   }
 };


 return (
   <div className="login-page">
     <div className="login-container">
       <h3>Login</h3>
       {error && <p className="error">{error}</p>}
       <form onSubmit={handleSubmit}>
         <label htmlFor="email">Email:</label>
         <input
           type="email"
           id="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="Enter your email"
           required
           autoFocus
           autoComplete="email"
         />


         <label htmlFor="password">Password:</label>
         <input
           type="password"
           id="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           placeholder="Enter your password"
           required
           autoComplete="current-password"
         />


         <button type="submit" disabled={!email || !password}>
           Login
         </button>
       </form>


       <div className="signup-link">
         <p>
           Don't have an account? <a href="/signup">Sign Up</a>
         </p>
       </div>
     </div>
   </div>
 );
}

