import React, {useEffect, useState, Suspense} from 'react'
const DashboardStatsGrid = React.lazy(() => import('./DashboardStatsGrid'));
const RecentTrips = React.lazy(() => import('./RecentTrips'));
import { getAllUsers, getAllDrivers } from '../../services/AuthService';
import { getAllTrips } from '../../services/TripService';
import { getAccessToken } from '../../services/AuthService';
import { jwtDecode } from "jwt-decode";
import { useNavigate} from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const token = getAccessToken();
  const [isLoading, setIsLoading] = useState(true);
  const [trips, setTips] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [tripInProgressCount, setTripInProgressCount] = useState(0);
  const [tripCompletedCount, setTripCompletedCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

 useEffect(() => {
    const fetchAll = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const currentTime = Date.now() / 1000;
          const decodedToken = jwtDecode(token);;

          if (decodedToken.exp < currentTime) {
            setIsSessionExpired(true);
            localStorage.removeItem('access_token'); // Clear expired token
            navigate('/login/admin/'); 
            return; // Exit function if session is expired
          } else {
            setIsSessionExpired(false);
          }

          // If the session is valid, proceed to fetch data
          const users = await getAllUsers();
          const drivers = await getAllDrivers();
          const trips = await getAllTrips();
          setTips(trips['trips'])
          console.log(trips['trips'])
          setUserCount(users['count']);
          setDriverCount(drivers['count']);
          setTripInProgressCount(trips['in_progress_count']);
          setTripCompletedCount(trips['completed_count']);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
        }
      } else {
        setIsSessionExpired(true); // No token found, assume expired
      }
    };

    fetchAll();
  }, []);
  
  return (
    <div className="flex justify-start items-center flex-col gap-4">
      {isSessionExpired && <p>Session expired. Please log in again.</p>}
      {isLoading ? (
        <div className="flex items-center h-full">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <Suspense >
          <DashboardStatsGrid userCount={userCount} driverCount={driverCount} tripInProgressCount={tripInProgressCount} tripCompletedCount={tripCompletedCount} />
          <RecentTrips trips={trips}  />
        </Suspense>
      )}
    </div>
  )
}

export default AdminDashboard

