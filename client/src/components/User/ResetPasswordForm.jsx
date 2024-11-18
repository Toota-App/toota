import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordForm = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/password-reset/${uidb64}/${token}`);
        if (response.status === 200) {
          setIsTokenValid(true);
        }
      } catch {
        setError('Invalid or expired token. Please request a new password reset link.');
      }
    };
    verifyToken();
  }, [uidb64, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/user/confirm-password-reset/`,
        { password, uidb64, token }
      );
      setSuccessMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.detail || 'An error occurred. Please try again later.');
    }
  };

  if (!isTokenValid) {
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md bg-white shadow-md rounded p-8">
        <h2 className="text-center text-lg mb-6">Reset Password <FaLock className="inline-block ml-2" /></h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-600">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border-gray-300 focus:ring focus:ring-orange-500 focus:outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-600 mr-4 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-600">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border-gray-300 focus:ring focus:ring-orange-500 focus:outline-none"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-600 mr-4 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
          >
            Reset Password
          </button>
          <p className="text-center mt-4">Finished setting up your password? <a href="/login/user" className="text-blue-500">Login here</a>.</p>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

