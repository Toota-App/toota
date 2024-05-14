import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from  '../../services/AuthService'


const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const token = getAccessToken();
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      };
      const refresh = localStorage.getItem('refresh_token')
      try {
        const res = await axios.post(`http://localhost:8000/api/user/logout/`, refresh, config);
        console.log(res.data)
        localStorage.removeItem('access_token');
        navigate('/login/user'); 
        return res
        } catch (err){
          console.error(err)
        }
      }
      handleLogout();
   }, [])
  
  return;
};

export default Logout;
