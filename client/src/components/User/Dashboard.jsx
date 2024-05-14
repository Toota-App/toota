import React, { useState, useEffect } from 'react';
import CreateTripForm from './CreateTripForm';
import { useNavigate} from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { getAccessToken , getUser} from "../../services/AuthService";

import { ToastContainer, toast } from 'react-toastify';
import supabase from '../../services/SupaBaseClient';


function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const token = getAccessToken()
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken["user_id"];
  supabase
  .channel('drivers').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trips_trip' }, (payload) => toast("Trip created successfully!")).subscribe()
 
  
  useEffect(() => {
    if (token) {
      
      try {
        
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          setIsSessionExpired(true);
          localStorage.removeItem('access_token'); // Clear expired token
          navigate('/login/user'); // Redirect to login on expiration
        } else {
          setIsSessionExpired(false);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsSessionExpired(true); // Handle decoding errors as expired
      }
    } else {
      setIsSessionExpired(true); // No token found, assume expired
    }
    
    
  }, [token]); // Update effect whenever token changes

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirmation = (confirmLogout) => {
    if (confirmLogout) {
      localStorage.removeItem('access_token'); // Remove token on logout
      navigate('/login/user'); // Redirect to login
    }
    setShowLogoutConfirmation(false);
  };
  
  return (
    <div className="">
         <CreateTripForm />
         <ToastContainer />

    </div>
  )
}

export default Dashboard