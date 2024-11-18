import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        setSuccessMessage('Reset link has been sent to your email.');
        resetForm();
      } else {
        const errorData = await response.json();
        setErrors({ email: errorData.message || 'An error occurred. Please try again later.' });
      }
    } catch (error) {
      setErrors({ email: 'An unexpected error occurred. Please try again later.' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <img src={logo} alt="Logo" className="mb-6 w-20 h-20" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white shadow-md rounded p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

            {successMessage && (
              <div className="text-green-700 bg-green-100 p-3 rounded mb-4 text-center">
                {successMessage}
              </div>
            )}

            <p className="text-gray-700 text-sm mb-4 text-center">
              Enter your email, and we’ll send you a link to reset your password.
            </p>

            <div className="mb-4">
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-orange-600"
            >
              Submit
            </button>

            <p className="text-center mt-4 text-sm">
              Remembered your password?{' '}
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

export default ForgotPasswordForm;

