import React, { useState, useEffect } from 'react';
import { ClockIcon, ClipboardCheckIcon } from '@heroicons/react/outline'; // Import required icons
import axios from 'axios'; // Import Axios library
import { getAllTrips } from "../services/TripService"; // Import the getAllTrips function from TripService
import { format } from 'date-fns'; // Import format function from date-fns library

const RideHistorySection = () => {
  // Define state to store ride history data
  const [rideHistory, setRideHistory] = useState([]);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        // Fetch all trips data from backend
        const response = await getAllTrips();
        const trips = response.trips; // Assuming `trips` is the property containing the array of trip objects

        // Log the fetched trips data for debugging
        console.log('Fetched trips data:', trips);

        // Transform and set the ride history data
        setRideHistory(
          trips.map((trip) => {
            // Log the start time of each trip
            console.log('Start time:', trip.pickup_time);

            // Check if the start time is a valid date
            if (trip.pickup_time && !isNaN(new Date(trip.pickup_time))) {
              return {
                id: trip.id,
                date: format(new Date(trip.pickup_time), 'yyyy-MM-dd'),
                pickupLocation: trip.pickup_location,
                dropOffLocation: trip.dropoff_location,
                fare: parseFloat(trip.bid), // Parse bid as float for the fare
                status: trip.status,
              };
            } else {
              // Handle invalid date values
              return {
                id: trip.id,
                date: 'Invalid Date',
                pickupLocation: trip.pickup_location,
                dropOffLocation: trip.dropoff_location,
                fare: parseFloat(trip.bid), // Parse bid as float for the fare
                status: trip.status,
              };
            }
          })
        );
      } catch (error) {
        // Log any errors that occur during the fetching process
        console.error('Error fetching ride history:', error);
      }
    };

    // Call the fetchRideHistory function
    fetchRideHistory();

  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Ride History</h2>
      {rideHistory.length > 0 ? (
        <div>
          {rideHistory.map((ride) => (
            <div key={ride.id} className="bg-white p-4 rounded-md shadow-md mb-4">
              <div className="flex items-center space-x-4">
                <ClockIcon className="h-8 w-8 text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Date: {ride.date}</h3>
                  <p className="text-gray-500">Pickup: {ride.pickupLocation}</p>
                  <p className="text-gray-500">Drop-off: {ride.dropOffLocation}</p>
                  <p className="text-gray-500">Fare: ${ride.fare.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ClipboardCheckIcon className="h-8 w-8 text-gray-600" />
                <p className="text-gray-500">Status: {ride.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-blue-500">No ride history available</p>
      )}
    </div>
  );
};

export default RideHistorySection;

