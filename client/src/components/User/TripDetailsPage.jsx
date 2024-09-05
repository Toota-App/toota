import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const libraries = ['places'];

const TripDetailsPage = () => {
    const { tripId } = useParams();
    const [tripDetails, setTripDetails] = useState(null);
    const [status, setStatus] = useState('Loading...');
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const fetchTripDetails = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/trip/${tripId}`);
            setTripDetails(response.data);
            setStatus(response.data.status);
        } catch (error) {
            console.error('Error fetching trip details:', error);
            setStatus('Failed to load trip details');
        }
    }, [tripId]);

    useEffect(() => {
        fetchTripDetails();
        const intervalId = setInterval(fetchTripDetails, 30000); // Poll every 30 seconds

        return () => clearInterval(intervalId); // Clean up on component unmount
    }, [fetchTripDetails]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-500';
            case 'In Progress':
                return 'bg-yellow-500';
            case 'Pending':
                return 'bg-gray-500';
            case 'Failed':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return isLoaded && tripDetails ? (
        <div className="p-8 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">Trip Details</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Status</h2>
                <div className={`text-white p-2 rounded ${getStatusColor(status)}`}>
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    {status}
                </div>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Pickup Location</h2>
                <div className="flex items-center mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-orange-500" />
                    <p>{tripDetails.pickup_location.location}</p>
                </div>
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-500" />
                    <p>Pickup Time: {new Date(tripDetails.pickup_time).toLocaleString()}</p>
                </div>
                <h2 className="text-xl font-semibold mb-2">Dropoff Location</h2>
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-500" />
                    <p>{tripDetails.dropoff_location.location}</p>
                </div>
            </div>
            <div className="relative">
                <GoogleMap
                    center={{ lat: tripDetails.pickup_location.lat, lng: tripDetails.pickup_location.lng }}
                    zoom={10}
                    mapContainerStyle={{ height: '400px', width: '100%' }}
                    options={{ styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }] }}
                >
                    <Marker position={{ lat: tripDetails.pickup_location.lat, lng: tripDetails.pickup_location.lng }} />
                    <Marker position={{ lat: tripDetails.dropoff_location.lat, lng: tripDetails.dropoff_location.lng }} />
                </GoogleMap>
                <div className="absolute top-0 right-0 p-4 bg-white rounded-lg shadow-lg">
                    <button
                        onClick={fetchTripDetails}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <p className="p-8">Loading...</p>
    );
};

export default TripDetailsPage;


