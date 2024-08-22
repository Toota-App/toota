import axios from 'axios'
import { getAccessToken } from './AuthService';


export const getTrip = async (id) => {
  const url = `${import.meta.env.VITE_BASE_URL}/api/trip/${id}/`;
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}`};
  try {
    const response =  axios.get(url, { headers });
    const trips = response.data
    return trips
  } catch (error) {
    return { response, isError: true };
  }
}

export const updateTrip = async (id, data) => {
  const url = `${import.meta.env.VITE_BASE_URL}/api/trip/${id}/`;
  const token = getAccessToken();
  
  const headers = { Authorization: `Bearer ${token}` };
  
  try {
    const response = await axios.put(url, data, { headers });
    const trips = response.data;
    return trips;
  } catch (error) {
    return { response: error.response, isError: true };
  }
};



export const getAllTrips = async () => {
  const token = getAccessToken(); 
  console.log(token);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/trip/all/`, config);
    const trip = response.data 
    return trip
  } catch(err) {
    console.error(err);
  }
};

export const getAllCompletedTrips = async () => {
  const token = getAccessToken(); 
  console.log(token);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/trip/completed/`, config);
    const trip = response.data 
    return trip
  } catch(err) {
    console.error(err);
  }
};