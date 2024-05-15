import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from "../../services/AuthService";
import { jwtDecode } from "jwt-decode";
const History = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleEndTrip = async () => {
    setIsSubmitting(true);
    try {
      const token = getAccessToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const tripId = selectedTrip.id;
      console.log('Ending trip with ID:', tripId);
      const response = await axios.patch(`http://localhost:8000/api/trip/${tripId}/`, { status: 'COMPLETED' }, config);
      console.log('End Trip Response:', response);
      setMessage({ text: 'Trip has completed.', type: 'success' });
      setSelectedTrip(null); // Reset selected trip after ending
      fetchTrips(); // Refresh trip list after ending
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error ending trip. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const decoded = jwtDecode(token);
      const driver_id = decoded['user_id']
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = `http://localhost:8000/api/trip/driver/${driver_id}`;
      console.log('URL:', url);
      const response = await axios.get(url, config);
      console.log('Response:', response);
      console.log('Data received:', response.data);
      if (Array.isArray(response.data)) {
        setTrips(response.data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching ride history:', err);
      setError('Error fetching ride history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      {isLoading ? (
        <p className="text-center text-gray-500">Loading ride history...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        trips.length > 0 ? (
          trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h2 className="text-lg font-bold">{trip.id}</h2>
              <p className="text-gray-600">Pickup Location: {trip.pickup_location}</p>
              <p className="text-gray-600">Dropoff Location: {trip.dropoff_location}</p>
              <p className="text-gray-600">Date: {trip.pickup_time}</p>
              <p className="text-gray-600">Status: {trip.status}</p>
              
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No ride history available.</p>
        )
      )}
    </div>
  );
};

export default History;

