import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAccessToken } from "../../services/AuthService";

const DriverCalendar = () => {
  const [token, setToken] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL"); // New state for filtering trips

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

      const updatedTrips = await Promise.all(
        response.data.map(async (trip) => {
          const { distance, duration } = await fetchDistanceAndDuration(
            trip.pickup_location.location,
            trip.dropoff_location.location
          );
          return { ...trip, distance, duration };
        })
      );

      setTrips(updatedTrips);
    } catch (err) {
      setError(`Failed to fetch trips: ${err.response?.status || ""} ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDistanceAndDuration = async (origin, destination) => {
    try {
      const proxy = `${import.meta.env.VITE_BASE_URL}/proxy`;
      const response = await axios.get(`${proxy}/maps/api/distancematrix/json`, {
        params: {
          origins: origin,
          destinations: destination,
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        },
      });

      const element = response.data.rows[0].elements[0];
      const distance = element.distance.text;
      const duration = element.duration.text;

      return { distance, duration };
    } catch (error) {
      console.error("Error fetching distance and duration:", error);
      return { distance: "N/A", duration: "N/A" };
    }
  };

  const handlePatchRequest = async (trip, status) => {
    if (!token) {
      setMessage({ text: "Authorization token is missing. Please log in again.", type: "error" });
      return;
    }
    if (status === "ACCEPTED" && inProgressTrip) {
      setMessage({ text: "Complete your current trip before accepting a new one.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/trip/${trip.id}/`, { status }, config);
      setMessage({ text: `Trip status updated to ${status}.`, type: "success" });
      if (status === "IN_PROGRESS") setInProgressTrip(trip);
      fetchTrips(token);
    } catch (err) {
      setMessage({ text: `Failed to update trip status: ${err.response?.status || ""} ${err.message}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewDirections = (pickup, dropoff) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      pickup
    )}&destination=${encodeURIComponent(dropoff)}`;
    window.open(mapsUrl, "_blank");
  };

  const filteredTrips = trips.filter((trip) => {
    if (filterStatus === "ALL") return true;
    return trip.status === filterStatus;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Driver Calendar</h1>
      <div className="flex justify-center mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="ALL">All</option>
          <option value="REQUESTED">Requested</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      {isLoading ? (
        <div className="text-center">Loading trips...</div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold">{trip.name}</h2>
                  <p className="text-gray-800 font-semibold">
                    {trip.duration} • {trip.distance}
                  </p>
                </div>
                {trip.status === "REQUESTED" && (
                  <button
                    onClick={() => handlePatchRequest(trip, "ACCEPTED")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Accept
                  </button>
                )}
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Fare:</span> ${trip.bid}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Pickup Time:</span> {trip.pickup_time}
              </p>
              <div className="mb-4">
                <p className="text-gray-700 flex items-center mb-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="font-semibold">Pickup:</span> {trip.pickup_location.location}
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="font-semibold">Dropoff:</span> {trip.dropoff_location.location}
                </p>
              </div>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Vehicle Type:</span> {trip.vehicle_type}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Load:</span> {trip.load_description}
              </p>
              <button
                onClick={() => viewDirections(trip.pickup_location.location, trip.dropoff_location.location)}
                className="bg-yellow-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-yellow-600"
              >
                View Directions
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No trips available for the selected status.</p>
      )}
    </div>
  );
};

export default DriverCalendar;

