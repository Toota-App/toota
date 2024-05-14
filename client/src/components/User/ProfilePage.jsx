import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaUser, FaPhone } from 'react-icons/fa'; // Import icons from Font Awesome icon pack
import {jwtDecode} from 'jwt-decode';
import { getUser } from  '../../services/AuthService';
import Loader from "react-js-loader";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const jwt = localStorage.getItem('access_token');
        
        if (jwt) {
          const response =  await getUser()
          console.log(response)
          setUser(response);
          setFormData({
            email: response.email,
            full_name: response.full_name,
            phone_number: response.phone_number,

          });
        } else {
          setErrorMessage('No authentication token available');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to fetch user profile data. Please try again.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jwt = localStorage.getItem('access_token');
      const new_user = jwtDecode(jwt);
      const user_id = new_user['user_id'];

      const response = await axios.patch(`http://localhost:8000/api/user/profile/${user_id}/`, formData, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      setUser(response.data);
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      setErrorMessage('Failed to update user profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading user profile....</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="mb-4 text-3xl font-bold">Profile</h1>
      {successMessage && (
        <div className="px-4 py-2 mb-4 text-green-800 bg-green-200 rounded">
          {successMessage}
        </div>
      )}
      {user && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          {editMode ? (
            <form onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="full_name" className="block mb-2 text-sm font-bold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone_number" className="block mb-2 text-sm font-bold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full leading-tight text-gray-700 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div>
              {/* Profile information */}
              <div className="p-4 mb-4 bg-gray-100 rounded-md">

                <p className="text-lg text-gray-800">
                  <strong><FaEnvelope /> Email:</strong> {user.email}
                </p>
                <p className="text-lg text-gray-800">
                  <strong><FaUser /> Full Name:</strong> {user.full_name}
                </p>
                <p className="text-lg text-gray-800">
                  <strong><FaPhone /> Phone Number:</strong> {user.phone_number}
                </p>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

