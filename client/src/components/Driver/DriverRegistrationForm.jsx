import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DriverRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    physical_address: '',
    vehicle_registration_no: '',
    vehicle_type: '',
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

    try {
      const response = await fetch('http://localhost:8000/api/driver/sign_up/', {
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
          vehicle_type: 'bike',
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
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-2/3 lg:w-1/2 xl:w-1/3" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 font-bold text-center">Driver Sign Up</h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            {successMessage}
          </div>
        )}

        {errors && Object.keys(errors).map((key) => (
          <div key={key} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {errors[key]}
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="full_name" className="block text-gray-700 font-bold mb-2">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your full name"
          />
        </div>
       
        <div className="mb-4">
  <label htmlFor="phone_number" className="block text-gray-700 font-bold mb-2">Phone Number</label>
  <input
    type="text"
    id="phone_number"
    name="phone_number"
    value={formData.phone_number}
    onChange={handleChange}
    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    placeholder="Enter your phone number"
  />
</div>

<div className="mb-4">
  <label htmlFor="physical_address" className="block text-gray-700 font-bold mb-2">Physical Address</label>
  <input
    type="text"
    id="physical_address"
    name="physical_address"
    value={formData.physical_address}
    onChange={handleChange}
    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    placeholder="Enter your physical address"
  />
</div>

<div className="mb-4">
  <label htmlFor="vehicle_registration_no" className="block text-gray-700 font-bold mb-2">Vehicle Registration Number</label>
  <input
    type="text"
    id="vehicle_registration_no"
    name="vehicle_registration_no"
    value={formData.vehicle_registration_no}
    onChange={handleChange}
    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    placeholder="Enter your vehicle registration number"
  />
</div>

<div className="mb-4">
  <label htmlFor="vehicle_type" className="block text-gray-700 font-bold mb-2">Vehicle Type</label>
  <select
    id="vehicle_type"
    name="vehicle_type"
    value={formData.vehicle_type}
    onChange={handleChange}
    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  >
    <option value="">Select vehicle type</option>
    <option value="bike">Bike</option>
    <option value="car">Car</option>
    <option value="van">Van</option>
    <option value="truck_1">Truck 1</option>
    <option value="truck_1.5">Truck 1.5</option>
    <option value="truck_2">Truck 2</option>
    <option value="truck_4">Truck 4</option>
  </select>
</div>

<div className="mb-4">
  <label htmlFor="licence_no" className="block text-gray-700 font-bold mb-2">Driver's Licence Number</label>
  <input
    type="text"
    id="licence_no"
    name="licence_no"
    value={formData.licence_no}
    onChange={handleChange}
    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    placeholder="Enter your driver's licence number"
  />
</div>

<div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
          <span
            className="text-gray-600 absolute right-0 mr-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>


<div className="mb-4">
  <label htmlFor="confirm_password" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
  <input
    type="password"
    id="confirm_password"
    name="confirm_password"
    value={formData.confirm_password}
    onChange={handleChange}
    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    placeholder="Confirm your password"
  />
</div>

        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-black hover:bg-gray-800 mt-6"
        >
          Register Your Account
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login/driver" className="text-blue-500 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default DriverRegistrationForm;

