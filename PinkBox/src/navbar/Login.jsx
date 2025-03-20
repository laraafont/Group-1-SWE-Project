import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const dummyUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    if (email === dummyUser.email && password === dummyUser.password) {
      console.log('Login successful!');
      setError('');
      navigate('/'); // Redirect on success
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h3>Login</h3>

      {error && <p className="error" aria-live="polite">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
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

        {/* Password Input */}
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}