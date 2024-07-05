import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../../services/AuthService';
import PaymentForm from './PaymentForm';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const DriverCalendar = () => {
  const token = getAccessToken();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);
  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/trip/`, config);
      const filteredTrips = response.data.filter(trip => trip.status !== 'COMPLETED');
      setTrips(filteredTrips);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAction = async (trip, status) => {
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/trip/${trip.id}/`, { status }, config);
      setMessage({ text: `Trip ${status.toLowerCase()}.`, type: 'success' });
      fetchTrips();
    } catch (err) {
      setMessage({ text: `Failed to ${status.toLowerCase()} trip. Please try again later.`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptTrip = (trip) => handleAction(trip, 'ACCEPTED');
  const handleStartTrip = (trip) => handleAction(trip, 'IN_PROGRESS');
  const handleEndTrip = (trip) => {
    handleAction(trip, 'COMPLETED');
    setSelectedTrip(trip);
    setShowPaymentModal(true);
  };
  const mapStyles = {        
    height: "200px",
    width: "100%"
  };

  const defaultCenter = {
    lat: -3.745,
    lng: -38.523
  };

  const calculateRoute = (trip) => {
    if (trip.pickup_location && trip.dropoff_location) {
      setDirections({
        origin: { lat: trip.pickup_location.latitude, lng: trip.pickup_location.longitude },
        destination: { lat: trip.dropoff_location.latitude, lng: trip.dropoff_location.longitude }
      });
    }
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
              <div key={trip.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold">{trip.name}</h2>
                  {trip.status === 'REQUESTED' && (
                    <button 
                      onClick={() => handleAcceptTrip(trip)} 
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Accept
                    </button>
                  )}
                  {trip.status === 'ACCEPTED' && (
                    <button 
                      onClick={() => handleStartTrip(trip)} 
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Start Trip
                    </button>
                  )}
                  {trip.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => { handleEndTrip(trip); handleOpenModal() }} 
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      End Trip
                    </button>
                  )}
                </div>
                <div className="text-gray-600">
                  <p><strong>Bid:</strong> {trip.bid}</p>
                  <p><strong>Number of Floors:</strong> {trip.number_of_floors}</p>
                  <p><strong>Load Description:</strong> {trip.load_description}</p>
                  <p><strong>Vehicle Type:</strong> {trip.vehicle_type}</p>
                  <p><strong>Updated:</strong> {new Date(trip.updated).toLocaleString()}</p>
                  <p><strong>Pickup Location:</strong> {trip.pickup_location.location} (Phone: {trip.pickup_location.phone_number})</p>
                  <p><strong>Dropoff Location:</strong> {trip.dropoff_location.location} (Phone: {trip.dropoff_location.phone_number})</p>
                  <p><strong>Pickup Time:</strong> {new Date(trip.pickup_time).toLocaleString()}</p>
                  {trip.status === 'ACCEPTED' && (
                    <p><strong>Drop-off Contact Number:</strong> {trip.dropoff_location.phone_number}</p>
                  )}
                  <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      mapContainerStyle={mapStyles}
                      zoom={13}
                      center={defaultCenter}
                      onLoad={() => calculateRoute(trip)}
                    >
                      {directions && (
                        <DirectionsRenderer
                          directions={directions}
                        />
                      )}
                      <Marker position={{ lat: trip.pickup_location.latitude, lng: trip.pickup_location.longitude }} />
                      <Marker position={{ lat: trip.dropoff_location.latitude, lng: trip.dropoff_location.longitude }} />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No active trips found.</p>
        )
      )}

      {selectedTrip && (
        <dialog open={showPaymentModal} className="modal">
          <div className="modal-box">
            <PaymentForm tripId={selectedTrip.id} driverId={selectedTrip.driver.id} bid={selectedTrip.bid} onSubmit={handlePaymentSubmit} token={token} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowPaymentModal(false)}>Close</button>
          </form>
        </dialog>
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

