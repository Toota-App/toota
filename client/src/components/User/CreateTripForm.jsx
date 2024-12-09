import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getAccessToken } from '../../services/AuthService';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faPhone,
    faClock,
    faFileAlt,
    faTruck,
    faBuilding,
    faMoneyBillWave,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';

const fetchTripStatus = async (tripId, token) => {
    try {
        // Corrected endpoint with 'trip' repeated in the URL path
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/trip/trip/${tripId}/status/`, // Updated URL path
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Authorization header with Bearer token
                },
            }
        );

        // Log and handle the trip status response
        console.log('Trip Status:', response.data);
        setMessage({ text: `Trip status: ${response.data.status}`, type: 'success' });
    } catch (error) {
        console.error('Error fetching trip status:', error);
        setMessage({ text: 'Failed to fetch trip status. Please try again.', type: 'error' });
    }
};


const libraries = ['places'];

const CreateTripForm = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [pickupPosition, setPickupPosition] = useState(null);
    const [dropoffPosition, setDropoffPosition] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); // Add currentStep state

    const autocompletePickupRef = useRef(null);
    const autocompleteDropoffRef = useRef(null);

    const token = getAccessToken();
    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.user_id;

    const formik = useFormik({
        initialValues: {
            pickup_location: {
                location: '',
                phone_number: '',
            },
            dropoff_location: {
                location: '',
                phone_number: '',
            },
            pickup_time: '',
            load_description: '',
            vehicle_type: '',
            number_of_floors: '',
            bid: '',
            user: user_id,
        },
        validationSchema: Yup.object({
            pickup_location: Yup.object({
                location: Yup.string().required('Pickup location is required'),
                phone_number: Yup.string()
                    .required('Pickup contact number is required')
                    .matches(/^\d+$/, 'Pickup contact number must be numeric')
                    .length(10, 'Pickup contact number must be exactly 10 digits'),
            }),
            dropoff_location: Yup.object({
                location: Yup.string().required('Dropoff location is required'),
                phone_number: Yup.string()
                    .required('Dropoff contact number is required')
                    .matches(/^\d+$/, 'Dropoff contact number must be numeric')
                    .length(10, 'Dropoff contact number must be exactly 10 digits'),
            }),
            pickup_time: Yup.string().required('Pickup time is required'),
            load_description: Yup.string().required('Load description is required'),
            vehicle_type: Yup.string().required('Vehicle type is required'),
            number_of_floors: Yup.number()
                .required('Number of floors is required')
                .min(0, 'Number of floors must be at least 0'),
            bid: Yup.number()
                .required('Bid amount is required')
                .min(50, 'Bid amount must be at least 50'),
        }),
        onSubmit: async (values) => {
    try {
        // Step 1: Send the request to create the trip
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/trip/`,
            values,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Step 2: Log the entire response for debugging
        console.log("Response from API:", response);

        // Step 3: Extract the tripId from the response (adjust based on your API response structure)
        const tripId = response.data.id; // Assuming `id` is the tripId

        // Step 4: Log tripId to confirm it's correctly retrieved
        console.log("Trip ID:", tripId);

        // Step 5: Reset the form
        formik.resetForm();

        // Step 6: Show success message
        setMessage({ text: 'Trip created successfully!', type: 'success' });

        // Step 7: Store the tripId (for later use in status page)
        // You might want to store it in a state or use it immediately
        // For example, you can store it in localStorage or context for global use
        localStorage.setItem('tripId', tripId); // or use a state to store tripId

        // TODO: Optionally navigate to Trip Status page with tripId
         navigate(`/dashboard/user/trip-status/${tripId}`);
        
        // Now, proceed to Stage 2 (fetching trip status) once the trip is created successfully.
        fetchTripStatus(tripId);
        
    } catch (error) {
        // Step 8: Handle errors if trip creation fails
        console.error("Error creating trip:", error);
        setMessage({ text: 'Failed to create trip. Please try again.', type: 'error' });
    }
},

});
    const handleCloseMessage = () => {
        setMessage(null);
    };

    const handleAddressSelect = useCallback((place, isPickup) => {
        const address = place.formatted_address;
        const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };

        if (isPickup) {
            setPickupPosition(position);
            formik.setFieldValue('pickup_location.location', address);
        } else {
            setDropoffPosition(position);
            formik.setFieldValue('dropoff_location.location', address);
        }
    }, []);

    const autocompleteOptions = {
        componentRestrictions: { country: 'za' },
        fields: ['formatted_address', 'geometry'],
    };

    return (
        <div className="w-full p-8 bg-gray-100 rounded-lg">
            {isLoaded ? (
                <form onSubmit={formik.handleSubmit} className="space-y-8">
                    {message && (
                        <div
                            className={`fixed top-0 inset-x-0 p-4 text-white ${
                                message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            } flex justify-between items-center`}
                        >
                            <span>{message.text}</span>
                            <button
                                onClick={handleCloseMessage}
                                className="text-xl ml-4 text-white font-bold focus:outline-none"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    )}
                    <div
                        className="text-3xl font-semibold text-center mb-6"
                        style={{ color: '#f89f1b' }}
                    >
                        Create Your Trip
                    </div>

                    {currentStep === 0 && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pickup Details */}
                                <div>
                                    <h2
                                        className="text-xl font-bold mb-4"
                                        style={{ color: '#f89f1b' }}
                                    >
                                        Pickup Details
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon
                                                icon={faMapMarkerAlt}
                                                className="mr-2"
                                            />
                                            Pickup Location
                                        </label>
                                        <Autocomplete
                                            onLoad={(autocomplete) =>
                                                (autocompletePickupRef.current = autocomplete)
                                            }
                                            onPlaceChanged={() => {
                                                const place =
                                                    autocompletePickupRef.current.getPlace();
                                                handleAddressSelect(place, true);
                                            }}
                                            options={autocompleteOptions}
                                        >
                                            <input
                                                type="text"
                                                name="pickup_location.location"
                                                value={formik.values.pickup_location.location}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Enter pickup location"
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.touched.pickup_location?.location &&
                                                    formik.errors.pickup_location?.location
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                required
                                            />
                                        </Autocomplete>
                                        {formik.touched.pickup_location?.location &&
                                        formik.errors.pickup_location?.location ? (
                                            <p className="text-red-500 text-xs italic">
                                                {formik.errors.pickup_location.location}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                className="mr-2"
                                            />
                                            Pickup Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            name="pickup_location.phone_number"
                                            value={formik.values.pickup_location.phone_number}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter pickup contact number"
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                formik.touched.pickup_location?.phone_number &&
                                                formik.errors.pickup_location?.phone_number
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            required
                                        />
                                        {formik.touched.pickup_location?.phone_number &&
                                        formik.errors.pickup_location?.phone_number ? (
                                            <p className="text-red-500 text-xs italic">
                                                {formik.errors.pickup_location.phone_number}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Dropoff Details */}
                                <div>
                                    <h2
                                        className="text-xl font-bold mb-4"
                                        style={{ color: '#f89f1b' }}
                                    >
                                        Dropoff Details
                                    </h2>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon
                                                icon={faMapMarkerAlt}
                                                className="mr-2"
                                            />
                                            Dropoff Location
                                        </label>
                                        <Autocomplete
                                            onLoad={(autocomplete) =>
                                                (autocompleteDropoffRef.current = autocomplete)
                                            }
                                            onPlaceChanged={() => {
                                                const place =
                                                    autocompleteDropoffRef.current.getPlace();
                                                handleAddressSelect(place, false);
                                            }}
                                            options={autocompleteOptions}
                                        >
                                            <input
                                                type="text"
                                                name="dropoff_location.location"
                                                value={formik.values.dropoff_location.location}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Enter dropoff location"
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.touched.dropoff_location?.location &&
                                                    formik.errors.dropoff_location?.location
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                required
                                            />
                                        </Autocomplete>
                                        {formik.touched.dropoff_location?.location &&
                                        formik.errors.dropoff_location?.location ? (
                                            <p className="text-red-500 text-xs italic">
                                                {formik.errors.dropoff_location.location}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                className="mr-2"
                                            />
                                            Dropoff Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            name="dropoff_location.phone_number"
                                            value={formik.values.dropoff_location.phone_number}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter dropoff contact number"
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                formik.touched.dropoff_location?.phone_number &&
                                                formik.errors.dropoff_location?.phone_number
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            required
                                        />
                                        {formik.touched.dropoff_location?.phone_number &&
                                        formik.errors.dropoff_location?.phone_number ? (
                                            <p className="text-red-500 text-xs italic">
                                                {formik.errors.dropoff_location.phone_number}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)} // Move to the next step
                                    className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 focus:outline-none"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div>
                            {/* Additional fields for the next step */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                                    Pickup Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="pickup_time"
                                    value={formik.values.pickup_time}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        formik.touched.pickup_time && formik.errors.pickup_time
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                    required
                                />
                                {formik.touched.pickup_time && formik.errors.pickup_time ? (
                                    <p className="text-red-500 text-xs italic">{formik.errors.pickup_time}</p>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                                    Load Description
                                </label>
                                <textarea
                                    name="load_description"
                                    value={formik.values.load_description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Describe the load"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        formik.touched.load_description && formik.errors.load_description
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                    required
                                />
                                {formik.touched.load_description && formik.errors.load_description ? (
                                    <p className="text-red-500 text-xs italic">{formik.errors.load_description}</p>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                    Vehicle Type
                                </label>
                                <select
                                    name="vehicle_type"
                                    value={formik.values.vehicle_type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        formik.touched.vehicle_type && formik.errors.vehicle_type
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                    required
                                >
                                    <option value="" label="Select vehicle type" />
                                    <option value="bakkie" label="Bakkie" />
                                    <option value="truck_1" label="1 ton Truck" />
                                    <option value="truck_1.5" label="1.5 ton Truck" />
                                    <option value="truck_2" label="2 ton Truck" />
                                    <option value="truck_4" label="4 ton Truck" />
                                    <option value="truck_8" label="8 ton Truck" />
                                </select>
                                {formik.touched.vehicle_type && formik.errors.vehicle_type ? (
                                    <p className="text-red-500 text-xs italic">{formik.errors.vehicle_type}</p>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                    Number of Floors
                                </label>
                                <input
                                    type="number"
                                    name="number_of_floors"
                                    value={formik.values.number_of_floors}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Number of floors"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        formik.touched.number_of_floors && formik.errors.number_of_floors
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                    required
                                />
                                {formik.touched.number_of_floors && formik.errors.number_of_floors ? (
                                    <p className="text-red-500 text-xs italic">{formik.errors.number_of_floors}</p>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                                    Bid Amount
                                </label>
                                <input
                                    type="number"
                                    name="bid"
                                    value={formik.values.bid}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your bid"
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        formik.touched.bid && formik.errors.bid
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                    required
                                />
                                {formik.touched.bid && formik.errors.bid ? (
                                    <p className="text-red-500 text-xs italic">{formik.errors.bid}</p>
                                ) : null}
                            </div>
                            <div className="text-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(0)} // Move to the previous step
                                    className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none mr-4"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 focus:outline-none"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CreateTripForm;

