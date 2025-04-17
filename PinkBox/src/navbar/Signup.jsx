import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";


export default function Signup() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [error, setError] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);


 const navigate = useNavigate();


 const handleSubmit = async (e) => {
   e.preventDefault();


   if (!email || !password || !confirmPassword) {
     setError("Please fill in all fields");
     return;
   }


   if (password !== confirmPassword) {
     setError("Passwords do not match");
     return;
   }


   try {
     const response = await fetch("http://localhost:4000/signup", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ email, password }),
     });


     const data = await response.json();


     if (!response.ok) {
       throw new Error(data.errors || "Failed to sign up");
     }


     console.log("Signup successful:", data);
     navigate("/"); // returns to homepage
   } catch (error) {
     setError(error.message);
   }
 };


 return (
   <div className="signup">
     <div className="signup-container">
       <h3>Sign Up</h3>


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
         <div className="password-container">
           <input
             type={showPassword ? "text" : "password"}
             id="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             placeholder="Enter your password"
             required
             autoComplete="new-password"
           />
           <label className="show-password">
             <input
               type="checkbox"
               checked={showPassword}
               onChange={() => setShowPassword(!showPassword)}
             />
             Show Password
           </label>
         </div>


         <label htmlFor="confirm-password">Confirm Password:</label>
         <div className="password-container">
           <input
             type={showConfirmPassword ? "text" : "password"}
             id="confirm-password"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             placeholder="Confirm your password"
             required
             autoComplete="new-password"
           />
           <label className="show-password">
             <input
               type="checkbox"
               checked={showConfirmPassword}
               onChange={() => setShowConfirmPassword(!showConfirmPassword)}
             />
             Show Password
           </label>
         </div>


         <button type="submit">Sign Up</button>
       </form>
     </div>
   </div>
 );
}
