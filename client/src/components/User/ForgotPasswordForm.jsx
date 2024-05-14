import React, { useState } from 'react';
import axios from 'axios';
import Message from './Message';

const ForgotPasswordForm = () => {
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
      const response = await axios.post('http://localhost:8000/api/user/password-reset/', { email });

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
    <div className="min-h-screen flex flex-col items-center justify-center">
      {message && <Message message={message} type={messageType} />}

      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-2/3 lg:w-1/2 xl:w-1/3" onSubmit={handleResetPassword}>
        <h2 className="text-2xl mb-6 font-bold text-center">Forgot Password</h2>

        <p className="text-gray-700 text-sm mb-4 text-center">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3"
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
            className="w-full bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-black hover:bg-gray-800"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

