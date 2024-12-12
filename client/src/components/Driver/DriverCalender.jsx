import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../../services/AuthService';
import PaymentForm from './PaymentForm';

const DriverCalendar = () => {
  const token = getAccessToken();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/trip/`, config);
      setTrips(response.data.filter(trip => trip.status !== 'COMPLETED'));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleAcceptTrip = async (trip) => {
    if (trips.some(t => t.status === 'IN_PROGRESS')) {
      setMessage({ text: 'Cannot accept another trip until the current trip is completed.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/trip/${trip.id}/`, { status: 'ACCEPTED' }, config);
      setMessage({ text: 'Trip accepted.', type: 'success' });
      fetchTrips();
    } catch (err) {
      setMessage({ text: 'Failed to accept trip. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartTrip = async (trip) => {
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/trip/${trip.id}/`, { status: 'IN_PROGRESS' }, config);
      setMessage({ text: 'Trip has started.', type: 'success' });
      fetchTrips();
    } catch (err) {
      setMessage({ text: 'Error starting trip. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndTrip = async (trip) => {
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/trip/${trip.id}/`, { status: 'COMPLETED' }, config);
      setMessage({ text: 'Trip completed.', type: 'success' });
      setSelectedTrip(trip);
      setShowPaymentModal(true);
      fetchTrips();
    } catch (err) {
      setMessage({ text: 'Error ending trip. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    // Handle payment submission here
  };

  const viewDirections = (pickup, dropoff) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      pickup
    )}&destination=${encodeURIComponent(dropoff)}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      <h1 className="text-2xl font-bold text-center mb-6">Driver Calendar</h1>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading trips...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map(trip => (
              <div key={trip.id} className="bg-gray-50 rounded-lg shadow-lg p-5 border border-gray-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">{trip.name}</h2>
                  {trip.status === 'REQUESTED' && (
                    <button 
                      onClick={() => handleAcceptTrip(trip)} 
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Accept
                    </button>
                  )}
                  {trip.status === 'ACCEPTED' && (
                    <button 
                      onClick={() => handleStartTrip(trip)} 
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Start Trip
                    </button>
                  )}
                  {trip.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => { handleEndTrip(trip); }} 
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                      End Trip
                    </button>
                  )}
                </div>
                <div className="text-gray-600">
                  <p><strong>Fare:</strong> <span className="text-black font-bold">ZAR {trip.bid}</span></p>
                  <p><strong>Pickup Time:</strong> {new Date(trip.pickup_time).toLocaleString()}</p>
                  <p><strong>Load Description:</strong> {trip.load_description}</p>
                  <p><strong>Vehicle Type:</strong> {trip.vehicle_type}</p>
                  <p><strong>Pickup Location:</strong> {trip.pickup_location.location}</p>
                  <p><strong>Dropoff Location:</strong> {trip.dropoff_location.location}</p>
                  <p><strong>Number of Floors:</strong> {trip.number_of_floors}</p>
                  {trip.status === 'ACCEPTED' && (
                    <p><strong>Contact Number:</strong> {trip.dropoff_location.phone_number}</p>
                  )}
                  {trip.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => viewDirections(trip.pickup_location.location, trip.dropoff_location.location)}
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
                      View Directions
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No active trips found.</p>
        )
      )}

      {message && (
        <div className={`mt-4 p-2 rounded ${message.type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
          <p className="text-sm text-gray-800">{message.text}</p>
          <button onClick={handleCloseMessage} className="text-sm text-gray-600 font-semibold mt-1">Close</button>
        </div>
      )}
    </div>
  );
};

export default DriverCalendar;

