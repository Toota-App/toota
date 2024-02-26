// src/components/User/ForgotPasswordForm.jsx
import React, { useState } from 'react';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add your form submission logic here
      // Example: const response = await submitForgotPasswordForm(email);

      // If the submission fails, handle the error
      // Example: if (response.error) throw new Error(response.error);

      // Display success message on successful submission
      setSuccessMessage('Check your email for a password reset link.');
      setError('');
    } catch (error) {
      // Handle the error and update the state with the error message
      setError(error.message || 'An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="bg-white rounded shadow-md p-6 w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>

        <p className="text-gray-700 text-sm mb-4">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow appearance-none"
            required
          />
        </div>

        <div className="text-red-600">{error}</div>
        <div className="text-green-600">{successMessage}</div>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline-black"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

