import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaUser, FaPhone, FaHome, FaCar, FaIdCard, FaLock, FaExclamationCircle } from 'react-icons/fa';
import logo from "../../assets/logo.png";


const DriverRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    physical_address: '',
    vehicle_registration_no: '',
    vehicle_type: 'truck_1',
    licence_no: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrors({});
  };

  useEffect(() => {
    const clearMessagesTimeout = setTimeout(() => {
      clearMessages();
    }, 7000);

    return () => clearTimeout(clearMessagesTimeout);
  }, [successMessage, errors]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setTimeout(() => {
      setShowPassword(false);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: "Passwords do not match" });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/driver/sign_up/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        setSuccessMessage('Driver account created successfully! Please check your email to verify.');
        setFormData({
          email: '',
          full_name: '',
          phone_number: '',
          physical_address: '',
          vehicle_registration_no: '',
          vehicle_type: 'truck_1',
          licence_no: '',
          password: '',
          confirm_password: '',
        });
      } else if (response.status === 400) {
        const errorData = await response.json();
        setErrors(errorData);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ generic: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#404042' }}>
      <form className="bg-white p-8 shadow-md rounded w-full max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Toota Logo" className="w-24 h-24" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-6 text-[#f89f1b]">Driver Sign Up</h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errors && Object.keys(errors).map((key) => (
          <div key={key} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <FaExclamationCircle className="mr-2" />
            <span>{errors[key]}</span>
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 flex items-center">
              <FaEnvelope className="mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 flex items-center">
              <FaUser className="mr-2" />
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 flex items-center">
              <FaPhone className="mr-2" />
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="physical_address" className="block text-sm font-semibold text-gray-700 flex items-center">
              <FaHome className="mr-2" />
              Physical Address
            </label>
            <input
              type="text"
              id="physical_address"
              name="physical_address"
              value={formData.physical_address}
              onChange={handleChange}
              placeholder="Enter your physical address"
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="vehicle_registration_no" className="block text-sm font-semibold text-gray-700 flex items-center">
              <FaCar className="mr-2" />
              Vehicle Registration Number
            </label>
            <input
              type="text"
              id="vehicle_registration_no"
              name="vehicle_registration_no"
              value={formData.vehicle_registration_no}
              onChange={handleChange}
              placeholder="Enter your vehicle registration number"
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="vehicle_type" className="block text-sm font-semibold text-gray-700 flex items-center">
              Vehicle Type
            </label>
            <select
              id="vehicle_type"
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            >
              <option value="">Select vehicle type</option>
	      <option value="bakkie">bakkie</option>
              <option value="truck_1">1 ton Truck</option>
              <option value="truck_1.5">1.5 ton Truck</option>
              <option value="truck_2">2 ton Truck</option>
              <option value="truck_4">4 ton Truck</option>
	      <option value="truck_8">8 ton Truck</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="licence_no" className="block text-sm font-semibold text-gray-700 flex items-center">
              <FaIdCard className="mr-2" />
              Driver's Licence Number
            </label>
            <input
              type="text"
              id="licence_no"
              name="licence_no"
              value={formData.licence_no}
              onChange={handleChange}
              placeholder="Enter your driver's licence number"
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 flex items-center">
              <FaLock className="mr-2" />
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 flex items-center">
              <FaLock className="mr-2" />
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#f89f1b] text-white py-3 rounded hover:bg-orange-600 transition duration-200"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center text-gray-700">
          Already have an account?{' '}
          <Link to="/login/driver" className="text-[#f89f1b] hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default DriverRegistrationForm;

