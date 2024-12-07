import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAccessToken } from "../../services/AuthService";
import PaymentForm from "./PaymentForm";

const DriverCalendar = () => {
  const [token, setToken] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const retrievedToken = getAccessToken();
    if (!retrievedToken) {
      setError("Authorization token is missing. Please log in again.");
      return;
    }
    setToken(retrievedToken);
    fetchTrips(retrievedToken);
  }, []);

  const fetchTrips = async (authToken) => {
    setIsLoading(true);
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/trip/`, config);
      setTrips(response.data.filter((trip) => trip.status !== "COMPLETED"));
    } catch (err) {
      setError(`Failed to fetch trips: ${err.response?.status || ""} ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatchRequest = async (trip, status) => {
    if (!token) {
      setMessage({ text: "Authorization token is missing. Please log in again.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/trip/${trip.id}/`, { status }, config);
      setMessage({ text: `Trip status updated to ${status}.`, type: "success" });
      fetchTrips(token);
    } catch (err) {
      setMessage({ text: `Failed to update trip status: ${err.response?.status || ""} ${err.message}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartTrip = async (trip) => {
    await handlePatchRequest(trip, "IN_PROGRESS");
  };

  const handleEndTrip = async (trip) => {
    await handlePatchRequest(trip, "COMPLETED");
    setSelectedTrip(trip);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    // Handle payment submission logic here
  };

  return (
    <div className="container mx-auto p-4 pt-6">
      <h1 className="text-2xl font-bold text-center mb-6">Driver Calendar</h1>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading trips...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{trip.name}</h2>
                {trip.status === "REQUESTED" && (
                  <button
                    onClick={() => handlePatchRequest(trip, "ACCEPTED")}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    Accept
                  </button>
                )}
                {trip.status === "ACCEPTED" && (
                  <button
                    onClick={() => handleStartTrip(trip)}
                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                  >
                    Start Trip
                  </button>
                )}
                {trip.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => handleEndTrip(trip)}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                    End Trip
                  </button>
                )}
              </div>
              <div className="text-gray-600">
                <p><strong>Bid:</strong> {trip.bid}</p>
                <p><strong>Pickup Location:</strong> {trip.pickup_location.location}</p>
                <p><strong>Dropoff Location:</strong> {trip.dropoff_location.location}</p>
                <p><strong>Vehicle Type:</strong> {trip.vehicle_type}</p>
                <p><strong>Status:</strong> {trip.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No active trips found.</p>
      )}

      {selectedTrip && (
        <dialog open={showPaymentModal} className="modal">
          <div className="modal-box">
            <PaymentForm
              tripId={selectedTrip.id}
              driverId={selectedTrip.driver?.id}
              bid={selectedTrip.bid}
              onSubmit={handlePaymentSubmit}
              token={token}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              className="text-sm text-gray-600 font-semibold"
              onClick={() => setShowPaymentModal(false)}
            >
              Close
            </button>
          </form>
        </dialog>
      )}

      {message && (
        <div
          className={`mt-4 p-2 rounded ${
            message.type === "success" ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
};

export default DriverCalendar;

