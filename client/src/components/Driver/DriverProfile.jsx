import React, { useState, useEffect } from 'react';
import { getDriver, getAccessToken } from "../../services/AuthService"

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    licence_no: '',
    criminal_record_check: '',
    vehicle_registration: '',
    physical_address: '',
    vehicle_registration_no: '',
    vehicle_type: '',


  });
  const token = getAccessToken();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submission logic to update backend with new profile data
    console.log('Form submitted with data:', formData);
    // After submission, switch back to view mode
    setEditMode(false);
  };
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        if (token){
          const response = await getDriver();
          console.log(response);
          setDriver(response);
          setFormData({
            email: response.email,
            full_name: response.full_name,
            phone_number: response.phone_number,
            vehicle_type: response.vehicle_type,
            physical_address: response.physical_address,
            licence_no: response.licence_no,
            identity_number: response.identity_number,
            vehicle_registration_no: response.vehicle_registration_no,
            vehicle_registration: response.vehicle_registration,
            criminal_record_check: response.criminal_record_check
          });
        }else {
          setErrorMessage('No authentication token available');
        }
        setLoading(false);

      } catch(err){
        console.error('Error fetching user profile:', err);
        setErrorMessage('Failed to fetch user profile data. Please try again.');
        setLoading(false);
      }
    }
    fetchDriver();
  },[]);

  if (loading) {
    return <p>Loading user profile....</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Driver Profile</h2>
      {editMode ? (
        // Edit mode: render form fields
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="full_name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input type="text" id="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input type="text" id="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full border-gray-300 rounded-md px-4 py-2" />
          </div>
           <div className="mb-4">
            <label htmlFor="licence_no" className="block text-gray-700 font-semibold mb-2">Licence Number</label>
            <input type="text" id="licence_no" value={formData.licence_no} onChange={handleInputChange} className="w-full border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="vehicle_registration_no" className="block text-gray-700 font-semibold mb-2">Vehicle Registration Number</label>
            <input type="text" id="vehicle_registration_no" value={formData.vehicle_registration_no} onChange={handleInputChange} className="w-full border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="vehicle_type" className="block text-gray-700 font-bold mb-2">Vehicle Type</label>
            <select
              id="vehicle_type"
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleInputChange}
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
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
        </form>
      ) : (
        // View mode: render profile information
        <>
          <div className="mb-4">
            <strong>Full Name:</strong> {driver.full_name}
          </div>
          <div className="mb-4">
            <strong>Email:</strong> {driver.email}
          </div>
          <div className="mb-4">
            <strong>Physical Address:</strong> {driver.physical_address}
          </div>
    
           <div className="mb-4">
            <strong>Driver Licence:</strong> {driver.licence_no}
          </div>
           <div className="mb-4">
            <strong>Vehicle Registration No:</strong> {driver.vehicle_registration_no}
          </div>
          
          <div className="mb-4">
            <strong>Vehicle:</strong> {driver.vehicle_type}
          </div>
          <div className="mb-4">
            <strong>Driver Rating:</strong> {formData.rating}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default DriverProfile;

