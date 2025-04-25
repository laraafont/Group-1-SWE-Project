import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoutMessage, setLogoutMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem("auth-token");
    console.log("Token found in Login.jsx:", token);
    setIsLoggedIn(token && token.length > 10);
  };
  
  // Check once on mount
  useEffect(() => {
    checkToken();
  }, []);


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
      checkToken();
      setError("");
      setIsLoggedIn(true); // Update login status
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setLogoutMessage("You have been logged out");
    setEmail('');
    setPassword('');
    checkToken();
    setTimeout(() => setLogoutMessage(''), 3000);
  };
  
  

  return (
    <div className="login-page">
      <div className="login-container">
        <h3>Login</h3>
        {error && <p className="error">{error}</p>}
        {logoutMessage && <p className="logout-message">{logoutMessage}</p>}
        
        {/* Show login form or logged-in message based on isLoggedIn */}
        {!isLoggedIn ? (
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
        ) : (
          <div>
            <p>You are already logged in.</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        <div className="signup-link">
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}