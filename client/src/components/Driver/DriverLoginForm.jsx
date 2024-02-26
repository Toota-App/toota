// DriverLoginForm.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';

const DriverLoginForm = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 shadow-md rounded w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center mb-4">LOGIN AS TOOTA DRIVER</h2>
        
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
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
      </form>
    </div>
  );
};

export default DriverLoginForm;

