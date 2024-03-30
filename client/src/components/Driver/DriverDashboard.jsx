import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';
import { BellIcon, UserIcon, CogIcon, ClockIcon, CurrencyDollarIcon, ClipboardCheckIcon } from '@heroicons/react/outline'; // Import required icons
import LogoutConfirmationForm from './LogoutConfirmationForm'; // Import the LogoutConfirmationForm component
import DriverProfileForm from "./DriverProfile";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false); // State variable to track profile editing mode
  const [tokenExpired, setTokenExpired] = useState(false); // State variable to track token expiration

  // Function to decode JWT token and check if it has expired
  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwt.decode(token);

      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        setTokenExpired(true); // Set tokenExpired state to true if token has expired
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration(); // Check token expiration when component mounts
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirmation = (confirmLogout) => {
    if (confirmLogout) {
      // Perform logout action
      localStorage.removeItem('token'); // Remove token from local storage
      navigate('/login/driver'); // Redirect to login page
    } else {
      setShowLogoutConfirmation(false);
    }
  };

  // Function to toggle profile editing mode
  const toggleEditingProfile = () => {
    setEditingProfile(prevEditingProfile => !prevEditingProfile);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">TOOTA</h1>
        <div className="flex gap-4">
          <NotificationIcon />
          <ProfileIcon />
          <LogoutIcon className="h-6 w-6 text-gray-600 cursor-pointer" onClick={handleLogout} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-6">
        {/* Display token expiration message if token has expired */}
        {tokenExpired && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <span>Your session has expired. Please log in again.</span>
          </div>
        )}

        {/* Dashboard Navigation */}
        <nav className="flex justify-between mb-8">
          <NavItem icon={<HomeIcon className="h-6 w-6" />} text="Dashboard" />
          <NavItem icon={<UserIcon className="h-6 w-6" />} text="Driver Profile" handleClick={toggleEditingProfile} /> {/* Added handleClick prop */}
          <NavItem icon={<BellIcon className="h-6 w-6" />} text="Notifications" />
        </nav>

        {/* Sections */}
        {editingProfile ? ( // Conditionally render profile form if editingProfile is true
          <DriverProfileForm onCancel={toggleEditingProfile} /> // Pass onCancel prop to handle canceling profile editing
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Render other sections here */}
            <DashboardSection icon={<ClockIcon className="h-8 w-8" />} title="Ongoing Rides" />
            <DashboardSection icon={<CurrencyDollarIcon className="h-8 w-8" />} title="Earnings and Statistics" />
            <DashboardSection icon={<ClipboardCheckIcon className="h-8 w-8" />} title="Ride History" />
            <DashboardSection icon={<CogIcon className="h-8 w-8" />} title="Settings and Support" />
          </section>
        )}
      </main>

      {/* Render LogoutConfirmationForm if showLogoutConfirmation is true */}
      {showLogoutConfirmation && (
        <LogoutConfirmationForm onConfirm={handleLogoutConfirmation} />
      )}
    </div>
  );
};

// Component for navigation items
const NavItem = ({ icon, text, handleClick }) => { // Added handleClick prop
  return (
    <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 cursor-pointer" onClick={handleClick}> {/* Added onClick event handler */}
      {icon}
      <span className="hidden md:inline">{text}</span>
    </div>
  );
};

// Component for dashboard sections
const DashboardSection = ({ icon, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      {icon}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

// Notification icon component
const NotificationIcon = () => {
  return (
    <div className="relative">
      <BellIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
      {/* Add notification badge if needed */}
      {/* <div className="bg-red-500 w-3 h-3 rounded-full absolute top-0 right-0 transform translate-x-1 -translate-y-1"></div> */}
    </div>
  );
};

// Profile icon component
const ProfileIcon = () => {
  return (
    <UserIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
  );
};

// Logout icon component
const LogoutIcon = ({ onClick }) => {
  return (
    <LogoutIcon className="h-6 w-6 text-gray-600 cursor-pointer" onClick={onClick} />
  );
};

export default DriverDashboard;

