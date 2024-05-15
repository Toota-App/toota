import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from "../../services/AuthService";
import PaymentForm from "./PaymentForm"

const DriverCalendar = () => {
  const token = getAccessToken();
  const [trips, setTrips] = useState([]);
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:8000/api/trip/`, config);
      console.log('Fetched Trips:', response.data);
      setTrips(response.data.filter(trip => trip.status !== 'COMPLETED')); // Filter out completed trips
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
    setPaymentAmount('');
    setPaymentSuccess(false);
  };

  const handleAcceptTrip = async (trip) => {
    setSelectedTrip(trip);
    setIsSubmitting(true);
    try {
      const token = getAccessToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const acceptResponse = await axios.patch(`http://localhost:8000/api/trip/${trip.id}/`, { status: 'ACCEPTED' }, config);
      console.log('Accept Trip Response:', acceptResponse);
      setMessage({ text: 'Trip accepted.', type: 'success' });
      // Update the status of the selected trip to 'ACCEPTED'
      setSelectedTrip(prevTrip => ({ ...prevTrip, status: 'ACCEPTED' }));
      fetchTrips();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to accept trip. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartTrip = async (trip) => {
    setSelectedTrip(trip)
    setIsSubmitting(true);
    try {
      const token = getAccessToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const tripId = trip.id;
      console.log('Starting trip with ID:', tripId);
      const startResponse = await axios.patch(`http://localhost:8000/api/trip/${tripId}/`, { status: 'IN_PROGRESS' }, config);
      console.log('Start Trip Response:', startResponse);
      setMessage({ text: 'Trip has started.', type: 'success' });
      setSelectedTrip(null); // Reset selected trip after starting
      fetchTrips(); // Refresh trip list after starting
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error starting trip. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndTrip = async (trip) => {
    setSelectedTrip(trip)
    setIsSubmitting(true);
    try {
      if (!selectedTrip) {
        console.error("No trip selected.");
        return;
      }
      const token = getAccessToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const tripId = trip.id;
      console.log('Ending trip with ID:', tripId);
      const endResponse = await axios.patch(`http://localhost:8000/api/trip/${tripId}/`, { status: 'COMPLETED' }, config);
      console.log('End Trip Response:', endResponse);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error ending trip. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    // Handle payment submission here, you can make an API call to process the payment
    // For simplicity, let's assume the payment is successful
   
  };
  const handleOpenModal = async () =>{
    setShowPaymentModal(true)
  }

  return (
    <div className="container mx-auto p-4 pt-6">
      {isLoading ? (
        <p className="text-center text-gray-500">Loading trips...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        trips.length > 0 ? (
          trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md p-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{trip.name}</h2>
                {/* Always display the Accept button unless the trip is already accepted */}
                {trip.status === 'REQUESTED' && (
                  <button onClick={() => handleAcceptTrip(trip)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Accept
                  </button>
                )}
                {trip.status === 'ACCEPTED' && (
                  <button onClick={() => { setSelectedTrip(trip);  handleStartTrip(trip)}} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Start Trip
                  </button>
                )}
                {trip.status === 'IN_PROGRESS' && (
                  <button onClick={() => { setSelectedTrip(trip); handleEndTrip(trip); handleOpenModal() }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    End Trip
                  </button>
                )}
              </div>
              <p className="text-gray-600">Bid: {trip.bid}</p>
              <p className="text-gray-600">Number of Floors: {trip.number_of_floors}</p>
              <p className="text-gray-600">Load Description: {trip.load_description}</p>
              <p className="text-gray-600">Vehicle Type: {trip.vehicle_type}</p>
              <p className="text-gray-600">Updated: {trip.updated}</p>
              <p className="text-gray-600">Pickup Location: {trip.pickup_location}</p>
              <p className="text-gray-600">Dropoff Location: {trip.dropoff_location}</p>
              <p className="text-gray-600">Pickup Time: {trip.pickup_time}</p>
              {/* Display drop-off contact number only when trip is accepted */}
              {trip.status === 'ACCEPTED' && <p className="text-gray-600">Drop-off Contact Number: {trip.dropoff_contact_number}</p>}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No active trips found.</p>
        )
      )}

      {selectedTrip && (
      <dialog open={showPaymentModal && !paymentSuccess} className="modal">
        <div className="modal-box">
          <PaymentForm tripId={selectedTrip.id} driverId={selectedTrip.driver}  bid={selectedTrip.bid} onSubmit={handlePaymentSubmit} token={token}/>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowPaymentModal(false)}>Close</button>
        </form>
      </dialog>
    )}


      {/* Thank You Message */}
  

      {/* Render message */}
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
