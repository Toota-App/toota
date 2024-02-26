// eslint-disable-next-line no-unused-vars
// src/components/User/UserLoginForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';

const UserLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded shadow-md p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-900">Login To TOOTA</h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline-black w-full"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Forgot your password?{' '}
          <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Reset it here
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account with Toota?{' '}
          <Link to="/signup/user" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLoginForm;

