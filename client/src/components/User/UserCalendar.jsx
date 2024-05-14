import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from "../../services/AuthService";

const UserCalendar = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:8000/api/user/trips/`, config);
      setTrips(response.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      {isLoading ? (
        <p className="text-center text-gray-500">Loading trips...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        trips.length > 0 ? (
          trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h2 className="text-lg font-bold">{trip.name}</h2>
              <p className="text-gray-600">Pickup Location: {trip.pickup_location}</p>
              <p className="text-gray-600">Dropoff Location: {trip.dropoff_location}</p>
              <p className="flex justify-center mt-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  View Details
                </button>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No upcoming trips found.</p>
        )
      )}
    </div>
  );
};

export default UserCalendar;

