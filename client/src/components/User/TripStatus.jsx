import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ClipLoader } from 'react-spinners'; // Spinner
import { getAccessToken } from '../../services/AuthService'; // Import the getAccessToken function

const TripStatus = () => {
  const { tripId } = useParams(); // Get tripId from the URL
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Matching you with the best driver nearby...');
  const [error, setError] = useState(null);

  const statusMessages = {
    loading: "Matching you with the best driver nearby...",
    accepted: "Driver accepted the trip. They’re on their way!",
    in_progress: "The driver is on the way to pick you up!",
    completed: "Trip completed! Thank you for riding with us!",
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Get the access token using the getAccessToken function
        const token = getAccessToken();

        // Check if the token is valid (optional)
        if (!token) {
          setError("You are not authorized. Please log in again.");
          return;
        }

        // Corrected endpoint with 'trip' repeated in the URL path
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/trip/trip/${tripId}/status/`, // Corrected URL structure
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use token from getAccessToken
            },
          }
        );

        const currentStatus = response.data.status;
        setStatus(currentStatus);
        setMessage(statusMessages[currentStatus] || 'Updating trip details...');
      } catch (err) {
        console.error("Error fetching trip status:", err);
        setError("Failed to fetch trip status. Please try again.");
      }
    };

    // Poll every 5 seconds (or you can implement WebSocket for real-time updates)
    const interval = setInterval(fetchStatus, 5000);
    fetchStatus(); // Initial fetch

    return () => clearInterval(interval); // Cleanup
  }, [tripId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-md">
      <img src={logo} alt="Company Logo" className="w-24 mb-4" />
      <div className="flex items-center gap-2">
        {status === 'loading' && <ClipLoader color="#FFD700" size={20} />}
        <p className="text-gray-700 text-center">{message}</p>
      </div>
    </div>
  );
};

export default TripStatus;

