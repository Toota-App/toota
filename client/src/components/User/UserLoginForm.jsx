import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from '../../assets/logo.png';

const UserLoginForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

const handleSubmit = async (values, { setErrors, setSubmitting }) => {
  try {
    // Use the base URL from the environment variables or fall back to a hardcoded URL
    const baseURL = import.meta.env.VITE_BASE_URL || "https://toota-gwgmcdefdqhde3g6.southafricanorth-01.azurewebsites.net/";
    const requestUrl = `${baseURL}/api/user/login/`;

    // Log the base URL and full request URL for debugging
    console.log("Base URL:", baseURL);
    console.log("Request URL:", requestUrl);

    // Send the POST request
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    // Log the response status for debugging
    console.log("Response Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Response Data:", data);

      if (data.access) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setSuccessMessage('Login successful! Redirecting to your dashboard...');
        setTimeout(() => navigate('/dashboard/user'), 2000);
      } else {
        throw new Error('Token not found in response');
      }
    } else {
      const errorData = await response.json();
      console.log("Error Response:", errorData);
      setErrors({ generic: errorData?.detail || 'Invalid email or password. Please try again.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    setErrors({ generic: 'An error occurred. Please try again later.' });
  } finally {
    setSubmitting(false);
  }
};









  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Toota Logo" className="h-20 md:h-24" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Welcome Back!</h2>
        <p className="text-center text-sm mb-6 text-gray-600">
          Log in to access your dashboard and manage your trips.
        </p>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email address"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  <FaLock className="inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Error Message */}
              {errors.generic && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">
                  {errors.generic}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white py-3 rounded font-bold hover:bg-orange-600 focus:outline-none"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-sm text-gray-500">
          Forgot your password?{' '}
          <Link to="/forgot-password" className="text-orange-500 font-semibold hover:underline">
            Reset it here
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup/user" className="text-orange-500 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLoginForm;

