// ProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../App"; // Adjust the path to point to the correct location of App.jsx
import { jwtDecode } from "jwt-decode"; // Importing jwt_decode from js-jwt library

import { FiMail, FiUser, FiPhone } from 'react-icons/fi'; // Import icons from react-icons/fi

const ProfilePage = () => {
  const { auth } = useContext(AuthContext);
  //const [jwt] = auth;
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: ''
  });
  const jwt = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (token) {
          const decodedToken = jwtDecode(token);
	  const user_id = decodedToken["user_id"]
          const response = await axios.get(`http://localhost:8000/user/profile/${user_id}`, {
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          });
          setUser(response.data);
          setFormData({
            email: response.data.email,
            full_name: response.data.full_name,
            phone_number: response.data.phone_number
          });
        } else {
          console.error('No authentication token available');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [jwt]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (jwt) {
        await axios.put(`http://localhost:8000/user/profile/${user.id}`, formData, {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
        alert('Profile updated successfully!');
      } else {
        console.error('No authentication token available');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      {user ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FiMail className="inline-block mr-2" /> Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FiUser className="inline-block mr-2" /> Full Name:
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FiPhone className="inline-block mr-2" /> Phone Number:
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="input-style"
                required
              />
            </div>
            <button
              type="submit"
              className="button-style"
            >
              Update Profile
            </button>
          </form>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;

