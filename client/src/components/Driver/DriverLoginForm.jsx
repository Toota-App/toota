import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode'
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa'; // Import icons

const DriverLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    if (tokenExpired) {
      setTimeout(() => {
        setTokenExpired(false);
      }, 3000);
    }
  }, [tokenExpired]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSuccess = (token) => {
    const decoded = jwt.decode(token);
    const userId = decoded.user_id;

    localStorage.setItem('userId', userId);
    navigate('/dashboard/driver');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/driver/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        handleLoginSuccess(data.access);
        setFormData({ email: '', password: '' });
        setFormErrors({});
        setSuccessMessage('Login successful!');
      } else {
        const errorMessage = data.detail;
        if (errorMessage === 'Token has expired') {
          setTokenExpired(true);
        }
        setFormErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      setFormErrors({ general: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 shadow-md rounded w-full sm:w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">LOGIN AS TOOTA DRIVER</h2>

        {/* Error Container */}
        {formErrors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <FaExclamationCircle className="mr-2" />
            <span>{formErrors.general}</span>
          </div>
        )}

        {/* Token Expiration Message */}
        {tokenExpired && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <FaExclamationCircle className="mr-2" />
            <span>Your session has expired. Please log in again.</span>
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600 flex items-center">
            <FaEnvelope className="mr-2" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-600 flex items-center">
            <FaLock className="mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline-black w-full"
        >
          LOG IN
        </button>

        {/* Additional Links */}
        <div className="mt-4 text-center">
          <p>
            Not a Toota driver?{' '}
            <Link to="/signup/driver" className="text-blue-500 hover:underline">Sign up here</Link>
          </p>
          <p>
            <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot your password?</Link>
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
            <span>{successMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default DriverLoginForm;

