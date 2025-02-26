import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // We'll create this file for styling

const Login = () => {
  // State to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // React Router hook to navigate between pages

  // Simulated login function (Replace this with actual authentication logic later)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the form from reloading the page
    if (email === "test@example.com" && password === "password") {
      alert("Login successful!"); // Placeholder action
      navigate("/profile"); // Redirect to Profile page on successful login
    } else {
      alert("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;