// DriverLoginForm.js

// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DriverLoginForm.css";

const DriverLoginForm = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Send login data to Django backend (implement this part)
    console.log("Login data:", loginData);
    // Redirect to driver dashboard or appropriate page
    navigate("/driver-dashboard");
  };

  return (
    <div className="driver-login-form">
      <h1 className="driver-heading">
        <span className="text-red-500">TOOTA</span>{" "}
        <span className="black-text">DRIVER</span>
      </h1>
      <div className="login-card">
        <h2 className="login-header">-- LOGIN IN --</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="driver-login-button">
            Login as Driver
          </button>
        </form>

        <div className="signup-link">
          Not a Toata driver? <Link to="/signup/driver">Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default DriverLoginForm;
