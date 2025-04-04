import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaUser, FaPhone, FaHome, FaCar, FaIdCard, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from '../../assets/logo.png';

const DriverRegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    full_name: Yup.string()
      .min(3, 'Full name must be at least 3 characters')
      .required('Full name is required'),
    phone_number: Yup.string()
      .matches(/^0\d{9}$/, 'Phone number must be 10 digits and start with 0')
      .required('Phone number is required'),
    physical_address: Yup.string().required('Physical address is required'),
    vehicle_registration_no: Yup.string()
      .matches(
        /^[A-Z]{1,3}\s?\d{1,6}\s?[A-Z]{0,3}$/,
        'Invalid vehicle registration number format (e.g., GP 123 ABC or CA 4567)'
      )
      .required('Vehicle registration number is required'),
    vehicle_type: Yup.string().required('Please select a vehicle type'),
    licence_no: Yup.string()
      .matches(
        /^[A-Z]?\d{8}-\d{2}$/,
        'Invalid driver's license number format (e.g., D12345678-01)'
      )
      .required('Driver's license number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });
      
  // Form Submission Handler with improved error handling and debugging
  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    // Clean values before sending (trim strings and ensure proper format)
    const cleanedValues = {
      ...values,
      phone_number: values.phone_number.trim(),
      vehicle_type: values.vehicle_type.trim(), // Make sure there's no whitespace
    };
    
    // For debugging only
    setDebugInfo({
      sending: cleanedValues
    });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/driver/sign_up/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(cleanedValues),
      });

      const responseData = await response.json();
      
      // Update debug info with response
      setDebugInfo(prev => ({
        ...prev,
        status: response.status,
        response: responseData
      }));

      if (response.status === 201) {
        setSuccessMessage('Driver account created successfully! Please check your email to verify.');
        resetForm();
      } else if (response.status === 400) {
        // Format backend errors to match Formik's error structure
        const formattedErrors = {};
        Object.keys(responseData).forEach(key => {
          if (Array.isArray(responseData[key])) {
            formattedErrors[key] = responseData[key][0];
          } else {
            formattedErrors[key] = responseData[key];
          }
        });
        setErrors(formattedErrors);
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setDebugInfo(prev => ({
        ...prev,
        error: error.message
      }));
      setErrors({ generic: 'An error occurred. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Carefully crafted vehicle types to match backend exactly
  const vehicleTypes = [
    { value: "truck_1", label: "1 Ton Truck" },
    { value: "truck_1.5", label: "1.5 Ton Truck" },
    { value: "truck_2", label: "2 Ton Truck" },
    { value: "truck_4", label: "4 Ton Truck" },
    { value: "bakkie", label: "Bakkie" },
    { value: "truck_8", label: "8 Ton Truck" }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <Formik
        initialValues={{
          email: '',
          full_name: '',
          phone_number: '',
          physical_address: '',
          vehicle_registration_no: '',
          vehicle_type: '',
          licence_no: '',
          password: '',
          confirm_password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form className="bg-white p-8 shadow-md rounded w-full max-w-3xl">
            {/* Logo and Header */}
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Toota Logo" className="w-24 h-24" />
            </div>
            <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">Driver Sign Up</h2>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            {/* Generic Error Message */}
            {errors.generic && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.generic}
              </div>
            )}

            {/* Debug Information (remove in production) */}
            {debugInfo && (
              <details className="mb-4 p-2 border border-gray-300 rounded">
                <summary className="font-semibold cursor-pointer">Debug Information</summary>
                <pre className="text-xs mt-2 p-2 bg-gray-100 overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                <Field
                  type="text"
                  id="full_name"
                  name="full_name"
                  placeholder="Enter your full name"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                />
                <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700">
                  <FaPhone className="inline mr-2" />
                  Phone Number
                </label>
                <Field
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  placeholder="Enter your phone number"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                />
                <ErrorMessage name="phone_number" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Physical Address */}
              <div>
                <label htmlFor="physical_address" className="block text-sm font-semibold text-gray-700">
                  <FaHome className="inline mr-2" />
                  Physical Address
                </label>
                <Field
                  type="text"
                  id="physical_address"
                  name="physical_address"
                  placeholder="Enter your address"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                />
                <ErrorMessage name="physical_address" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Vehicle Registration Number */}
              <div>
                <label htmlFor="vehicle_registration_no" className="block text-sm font-semibold text-gray-700">
                  <FaCar className="inline mr-2" />
                  Vehicle Registration No
                </label>
                <Field
                  type="text"
                  id="vehicle_registration_no"
                  name="vehicle_registration_no"
                  placeholder="Enter your vehicle registration number"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                />
                <ErrorMessage name="vehicle_registration_no" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Vehicle Type - Modified to ensure exact value matching */}
              <div>
                <label htmlFor="vehicle_type" className="block text-sm font-semibold text-gray-700">
                  <FaCar className="inline mr-2" />
                  Vehicle Type
                </label>
                <Field
                  as="select"
                  id="vehicle_type"
                  name="vehicle_type"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="vehicle_type" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Driver's License Number */}
              <div>
                <label htmlFor="licence_no" className="block text-sm font-semibold text-gray-700">
                  <FaIdCard className="inline mr-2" />
                  License No
                </label>
                <Field
                  type="text"
                  id="licence_no"
                  name="licence_no"
                  placeholder="Enter your license number"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                />
                <ErrorMessage name="licence_no" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password */}
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700">
                  <FaLock className="inline mr-2" />
                  Confirm Password
                </label>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="Confirm your password"
                  className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-orange-500"
                />
                <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded font-bold hover:bg-orange-600 focus:outline-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Sign Up'}
              </button>
            </div>

            {/* Login Redirect */}
            <p className="text-center mt-4 text-sm">
              Already have an account?{' '}
              <Link to="/login/driver" className="text-orange-500 hover:underline">
                Log In
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DriverRegistrationForm;
