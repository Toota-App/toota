import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const DriverResetPasswordForm = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log('Verifying token...');
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/driver/password-reset/${uidb64}/${token}/`);
        console.log('Token verification response:', response);
        if (response.status === 200) {
          console.log('Token is valid');
          setIsTokenValid(true);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setError('Invalid or expired token. Please request a new password reset link.');
      }
    };
    verifyToken();
  }, [uidb64, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting password reset form...');
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
        `http://localhost:8000/api/driver/confirm-password-reset/`,
        { password, uidb64, token }
      );
      console.log('Password reset response:', response);
      setSuccessMessage(response.data.message);
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.response) {
        setError(error.response.data.detail || 'An error occurred. Please try again later.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  if (!isTokenValid) {
    console.log('Token is not valid yet, waiting...');
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md bg-white shadow-md rounded p-8">
        <h2 className="text-center text-lg mb-6">Driver Reset Password <FaLock className="inline-block ml-2" /></h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative border border-gray-300 rounded">
            <label htmlFor="password" className="block mb-2 text-gray-600">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border-transparent focus:border-black focus:outline-none"
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-600 mr-4 cursor-pointer">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-6 relative border border-gray-300 rounded">
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-600">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border-transparent focus:border-black focus:outline-none"
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-600 mr-4 cursor-pointer">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => window.location.href="/login/driver"}>
                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.354 5.354a2 2 0 0 1 2.828 2.828l-9 9a2 2 0 0 1-2.828 0l-9-9a2 2 0 1 1 2.828-2.828L10 11.172l4.243-4.243z"/></svg>
              </span>
            </div>
          )}
          <button type="submit" className="w-full px-4 py-2 bg-black text-white rounded focus:outline-none hover:bg-gray-800">Reset Password</button>
          <p className="text-center mt-4">Finished setting up your password? <a href="/login/driver" className="text-blue-500">Login here</a>.</p>
        </form>
      </div>
    </div>
  );
};

export default DriverResetPasswordForm;

