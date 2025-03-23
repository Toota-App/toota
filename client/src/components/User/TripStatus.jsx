import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import logo from '../../assets/logo.png';
import { getAccessToken } from '../../services/AuthService';

const TripStatus = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null); // Store full trip details
  const [error, setError] = useState(null);

  const statusMessages = {
    REQUESTED: "Matching you with the best driver nearby...",
    ACCEPTED: "Driver accepted the trip. They’re on their way!",
    IN_PROGRESS: "The driver is on the way to pick you up!",
    COMPLETED: "Trip completed! Thank you for riding with us!",
    CANCELLED: "The trip has been cancelled.",
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          setError("You are not authorized. Please log in again.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/trip/trip/${tripId}/status/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTrip(response.data);
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to fetch trip details. Please try again.");
      }
    };

    const interval = setInterval(fetchTripDetails, 5000);
    fetchTripDetails();

    return () => clearInterval(interval);
  }, [tripId]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#FFD700" size={50} />
      </div>
    );
  }

  const { status, driver_name, driver_phone } = trip;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <img src={logo} alt="Company Logo" className="w-24 mb-6" />
      <div className="relative top-[-10%] w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Trip Status
        </h2>
        <p className="text-gray-700 text-center mb-6">
          {statusMessages[status] || "Updating trip details..."}
        </p>
        {status === 'ACCEPTED' || status === 'IN_PROGRESS' ? (
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-gray-800">
              <strong>Driver Name:</strong> {driver_name || 'N/A'}
            </p>
            <p className="text-gray-800">
              <strong>Driver Phone:</strong> {driver_phone || 'N/A'}
            </p>
          </div>
        ) : null}
        {status === 'COMPLETED' && (
          <p className="text-green-600 text-center mt-4 font-semibold">
            Trip completed! Thank you for choosing us.
          </p>
        )}
      </div>
    </div>
  );
};

export default TripStatus;

