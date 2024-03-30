import axios from 'axios';

const BASE_URL = 'http://localhost:8000';
export const sigupUser = async (data) => {
  return await axios.post(`${BASE_URL}/api/sign_up`, data,{
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const loginUser = async (data) => {
    return await axios.post(`${BASE_URL}/api/login`, data,{
        headers: {
        'Content-Type': 'application/json'
        }
    });
}
