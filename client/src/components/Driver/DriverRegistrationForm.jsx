// DriverRegistrationForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add your form submission logic using the formData
    console.log(formData);
  };

  return (
    <div className="flex items-center justify-center h-screen mt-40 px-4">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Driver Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="full_name">
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
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
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
            </div>

            {/* Repeat similar code for other fields... */}
	    <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="phone_number">
           Phone Number
          </label>
          <input
          type="text"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          className="w-full px-3 py-2 border rounded"
      required
    />
          </div>

      <div className="mb-4">
      <label className="block text-sm font-semibold mb-2" htmlFor="physical_address">
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
  </div>

     <div className="mb-4">
     <label className="block text-sm font-semibold mb-2" htmlFor="vehicle_registration">
      Vehicle Registration
    </label>
    <input
      type="text"
      id="vehicle_registration"
      name="vehicle_registration"
      value={formData.vehicle_registration}
      onChange={handleInputChange}
      placeholder="Enter your vehicle registration"
      className="w-full px-3 py-2 border rounded"
      required
    />
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
      <option value="">Select your vehicle type</option>
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
      Driver's Licence Number
    </label>
    <input
      type="text"
      id="licence_no"
      name="licence_no"
      value={formData.licence_no}
      onChange={handleInputChange}
      placeholder="Enter your driver's licence number"
      className="w-full px-3 py-2 border rounded"
      required
    />
  </div>

  <div className="mb-4">
    <label className="block text-sm font-semibold mb-2" htmlFor="password1">
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
  </div>

  <div className="mb-6">
    <label className="block text-sm font-semibold mb-2" htmlFor="password2">
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
  </div>	  

       <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline-black"
              >
                Register as a Driver
              </button>
            </div>
          </form>

          <div className="text-sm text-gray-600">
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

