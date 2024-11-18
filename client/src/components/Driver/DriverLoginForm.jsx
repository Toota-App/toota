import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from "../../assets/logo.png";

const DriverLoginForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/driver/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setFieldError('general', 'Invalid email or password. Please try again.');
        } else {
          setFieldError('general', responseData.detail || 'An error occurred.');
        }
      } else {
        localStorage.setItem('access_token', responseData.access);
        setTimeout(() => {
          navigate('/dashboard/driver');
        }, 2000);
      }
    } catch (error) {
      setFieldError('general', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="bg-white p-8 shadow-md rounded w-full sm:w-96">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Toota Logo" className="w-32 h-32" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4 text-[#f89f1b]">LOGIN AS TOOTA DRIVER</h2>

            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                <FaExclamationCircle className="mr-2" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-600 flex items-center">
                <FaEnvelope className="mr-2" />
                Email
              </label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full mt-1 p-2 border rounded focus:outline-none ${
                  errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-600 flex items-center">
                <FaLock className="mr-2" />
                Password
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  className={`w-full mt-1 p-2 border rounded focus:outline-none ${
                    errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded ${
                isSubmitting ? 'bg-gray-400' : 'bg-[#f89f1b]'
              } text-white hover:bg-[#d78516] focus:outline-none focus:shadow-outline`}
            >
              {isSubmitting ? 'Logging in...' : 'LOG IN'}
            </button>

            {/* Links */}
            <div className="mt-4 text-center">
              <p>
                Not a Toota driver?{' '}
                <Link to="/signup/driver" className="text-blue-500 hover:underline">
                  Sign up here
                </Link>
              </p>
              <p>
                <Link to="/driver-forgot-password" className="text-blue-500 hover:underline">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DriverLoginForm;

