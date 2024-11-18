import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Phone Number must be 10 digits')
      .required('Phone Number is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/sign_up/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Please check your email to verify.');
        resetForm();
      } else if (response.status === 400) {
        const errorData = await response.json();
        setErrors(errorData);
      } else {
        setErrors({ generic: 'An error occurred. Please try again later.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ generic: 'An error occurred. Please try again later.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* Logo and Welcome Section */}
      <div className="text-center mb-8">
        <img src={logo} alt="Toota Logo" className="w-24 h-auto mx-auto mb-4" />
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to Toota!</h1>
        <p className="text-gray-600 mt-2">Move goods with ease, whether it’s property, packages, or more.</p>
      </div>

      {/* Registration Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="bg-white shadow-lg rounded p-6 w-full max-w-md">
            {successMessage && (
              <div className="text-green-700 bg-green-100 p-3 rounded mb-4 text-center">{successMessage}</div>
            )}
            {errors.generic && (
              <div className="text-red-700 bg-red-100 p-3 rounded mb-4 text-center">{errors.generic}</div>
            )}

            <div className="mb-4">
              <Field
                name="fullName"
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <Field
                name="phoneNumber"
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4 relative">
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4 relative">
              <Field
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600"
            >
              Register Your Account
            </button>

            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login/user" className="text-blue-500 hover:underline">
                Log in here
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserRegistrationForm;

