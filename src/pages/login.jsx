import React, { useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection
import axios from 'axios';  // Import axios for making the HTTP request

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // State to store error messages
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to backend with email and password
      const response = await axios.post('http://localhost:5000/login', { email, password });
      
      if (response.status === 200) {
        // If login is successful, redirect to a blank page
        navigate('/home');  // Adjust the route if needed
      }
    } catch (error) {
      // Handle error, display error message
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('Server error, please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {error && <p className="login-error">{error}</p>} {/* Display error message */}
        <p className="login-footer">
          Don't have an account? <a href="#">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
