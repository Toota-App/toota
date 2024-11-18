import React, { useState } from 'react';
import axios from 'axios';
import Message from './Message';
import logo from "../../assets/logo.png";


const DriverForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (!email.trim()) {
        setMessage('Email is required.');
        setMessageType('error');
        return;
      }

      // Make the backend API call to send reset password link
      const response = await axios.post(`http://127.0.0.1:8000/api/driver/password-reset/`, { email });

      if (response.status === 200) {
        setMessage('Reset link has been sent to your email.');
        setMessageType('success');
      }
    } catch (error) {
      setMessage(error.response.data.message || 'An unexpected error occurred.');
      setMessageType('error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#404042] px-4">
      <div className="bg-white rounded shadow-md w-full max-w-lg p-6">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Toota Logo" className="w-24 h-24" />
        </div>
        {message && <Message message={message} type={messageType} />}
        <form className="w-full" onSubmit={handleResetPassword}>
          <h2 className="text-3xl font-bold mb-6 text-[#f89f1b] text-center">Driver Forgot Password</h2>
          <p className="text-gray-700 mb-4 text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              id="email"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <button
              className="w-full bg-[#f89f1b] text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-200 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForgotPasswordForm;

