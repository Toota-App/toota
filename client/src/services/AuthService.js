import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

export const getAccessToken = () => {
	return localStorage.getItem('access_token');
};


export const getUser = async () => {
	const token = getAccessToken(); // Corrected variable declaration;
	const config = { headers: { Authorization: `Bearer ${token}` } };

	try {
		const decodedToken = jwtDecode(token); // Decode the JWT token
		const user_id = decodedToken["user_id"];
		const response = await axios.get(`http://localhost:8000/api/user/profile/${user_id}/`, config);
		const userData = response.data 
		return userData
	} catch(err) {
		console.error(err);
	}
};

export const getAllUsers = async () => {
	const token = getAccessToken(); 
	const config = { headers: { Authorization: `Bearer ${token}` } };

	try {
		const decodedToken = jwtDecode(token); // Decode the JWT token
		const user_id = decodedToken["user_id"];
		const response = await axios.get(`http://localhost:8000/api/users/`, config);
		const userData = response.data 
		return userData
	} catch(err) {
		console.error(err);
	}
};

export const getAllDrivers = async () => {
	const token = getAccessToken(); 
	console.log(token);
	const config = { headers: { Authorization: `Bearer ${token}` } };

	try {
		const decodedToken = jwtDecode(token); // Decode the JWT token
		const user_id = decodedToken["user_id"];
		const response = await axios.get(`http://localhost:8000/api/drivers/`, config);
		const userData = response.data 
		return userData
	} catch(err) {
		console.error(err);
	}
};


export const getDriver = async () => {
	const token = getAccessToken();
	const config = { headers: { Authorization: `Bearer ${token}` } };
	try {
		const decodedToken = jwtDecode(token); // Decode the JWT token
		const user_id = decodedToken["user_id"];
		console.log(user_id)
		const response = await axios.get(`http://localhost:8000/api/driver/profile/${user_id}/`, config);
		const userData = response.data 
		return userData
	} catch(err) {
		console.error(err);
	}

}

