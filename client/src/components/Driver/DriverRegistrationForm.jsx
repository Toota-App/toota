import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCar, FaIdCard, FaLock } from 'react-icons/fa';
import axios from 'axios'; 

const DriverRegistrationForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    physical_address: '',
    vehicle_registration: '',
    vehicle_type: 'bike',
    licence_no: '',
    password1: '',
    password2: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/driver/sign_up/', formData);
      setSuccessMessage(response.data.message);
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        physical_address: '',
        vehicle_registration: '',
        vehicle_type: 'bike',
        licence_no: '',
        password1: '',
        password2: '',
      });
      setFormErrors({});
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        console.error('An error occurred:', error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen mt-8 bg-gray-100">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Driver Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="full_name">
                <FaUser className="inline-block mr-2" />
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded"
                required
              />
              {formErrors.full_name && <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                <FaEnvelope className="inline-block mr-2" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded"
                required
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="phone_number">
                <FaPhone className="inline-block mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border rounded"
                required
              />
              {formErrors.phone_number && <p className="text-red-500 text-sm mt-1">{formErrors.phone_number}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="physical_address">
                <FaMapMarkerAlt className="inline-block mr-2" />
                Physical Address
              </label>
              <input
                type="text"
                id="physical_address"
                name="physical_address"
                value={formData.physical_address}
                onChange={handleInputChange}
                placeholder="Enter your physical address"
                className="w-full px-3 py-2 border rounded"
                required
              />
              {formErrors.physical_address && <p className="text-red-500 text-sm mt-1">{formErrors.physical_address}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="vehicle_registration">
                <FaCar className="inline-block mr-2" />
                Vehicle Registration
              </label>
              <input
                type="text"
                id="vehicle_registration"
                name="vehicle_registration"
                value={formData.vehicle_registration}
                onChange={handleInputChange}
                placeholder="Enter your vehicle registration number"
                className="w-full px-3 py-2 border rounded"
                required
              />
              {formErrors.vehicle_registration && <p className="text-red-500 text-sm mt-1">{formErrors.vehicle_registration}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="vehicle_type">
                Vehicle Type
              </label>
              <select
                id="vehicle_type"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
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
              <label className="block text-sm font-semibold mb-2" htmlFor="licence_no">
                <FaIdCard className="inline-block mr-2" />
                Licence Number
              </label>
              <input
                type="text"
                id="licence_no"
                name="licence_no"
                value={formData.licence_no}
                onChange={handleInputChange}
                placeholder="Enter your licence number"
                className="w-full px-3 py-2 border rounded"
                required
              />
              {formErrors.licence_no && <p className="text-red-500 text-sm mt-1">{formErrors.licence_no}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="password1">
                <FaLock className="inline-block mr-2" />
                Password
              </label>
              <input
                type="password"
                id="password1"
                name="password1"
                value={formData.password1}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded"
                required
              />
              {formErrors.password1 && <p className="text-red-500 text-sm mt-1">{formErrors.password1}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" htmlFor="password2">
                <FaLock className="inline-block mr-2" />
                Confirm Password
              </label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border rounded"
                required
              />
              {formErrors.password2 && <p className="text-red-500 text-sm mt-1">{formErrors.password2}</p>}
            </div>

            {/* Success Message */}
            {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

            {/* Submit Button */}
            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline-black"
              >
                Register as a Driver
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-sm text-gray-600 text-center">
            Already have a driver's account?{' '}
            <Link to="/login/driver" className="text-blue-500 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistrationForm;


