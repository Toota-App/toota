import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import DriverLoginForm from "./components/Driver/DriverLoginForm";
import DriverRegistrationForm from "./components/Driver/DriverRegistrationForm";
import DriverProfile from "./components/Driver/DriverProfile"
import History from './components/Driver/History'
import UserLoginForm from "./components/User/UserLoginForm";
import UserRegistrationForm from "./components/User/UserRegistrationForm";
import ForgotPasswordForm from "./components/User/ForgotPasswordForm";
import ResetPasswordForm from "./components/User/ResetPasswordForm";
import DriverForgotPasswordForm from "./components/Driver/DriverForgotPasswordForm";
import DriverResetPasswordForm from "./components/Driver/DriverResetPasswordForm";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import AboutUs from "./pages/AboutUs";
import BecomeDriver from "./pages/BecomeDriver";
import FAQPage from './pages/FAQPage';

import Dashboard from './components/User/Dashboard';
import TripStatus from './components/User/TripStatus';
import DriverDashboard from './components/Driver/DriverDashboard';
import DocumentUploadForm from "./components/Driver/DocumentUploadForm";
import ProfilePage from './components/User/ProfilePage';
import Layout from './components/Layout/User/Layout';
import LayoutDriver from './components/Layout/Driver/LayoutDriver'
import RideHistory from './pages/RideHistory';
import Calendar from './pages/Calendar';
import Logout from './components/User/Logout';
import DriverLogout from './components/Driver/DriverLogout'
import LayoutAdmin from './components/Layout/Admin/LayoutAdmin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminProfile from './components/Admin/AdminProfile';
import Drivers from './components/Admin/Drivers';
import Users from './components/Admin/Users';
import Trips from './components/Admin/Trips';
import Payments from './components/Admin/Payments';
import AdminLogout from './components/Admin/AdminLogout';
import AdminLogin from './components/Admin/AdminLogin';
import AdminSignup from './components/Admin/AdminSignup';
import UserCalendar from './components/User/UserCalendar';
import DriverCalender from './components/Driver/DriverCalender';
import DriverDetails from './components/Driver/DriverCalender';


function App() {

  return (
    <Router>
      
        <Routes>
          <Route path="/signup/driver" element={<DriverRegistrationForm />} />
          <Route path="/login/driver" element={<DriverLoginForm />} />
          <Route path="/signup/user" element={<UserRegistrationForm />} />
          <Route path="/login/user" element={<UserLoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordForm />} />
	  <Route path="/driver-forgot-password" element={<DriverForgotPasswordForm />} />
	  <Route path="/driver-reset-password/:uidb64/:token" element={<DriverResetPasswordForm />} />
	  <Route path="/driver-verification-documents" element={<DocumentUploadForm />} />
          <Route path="/dashboard/user/" element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='trip-history' element= {<RideHistory />} />
            <Route path='calendar' element={<UserCalendar />} />
            <Route path='logout' element={<Logout />} />
	    //<Route path='track-status' element={TripStatus />} />
	    <Route path="trip-status/:tripId" element={<TripStatus />} />
          </Route>
          <Route path="/signup/admin/" element={<AdminSignup />} />
          <Route path="/login/admin/" element={<AdminLogin />} />
          <Route path="/dashboard/admin/" element={<LayoutAdmin />} >
            <Route index element={<AdminDashboard />} />
            <Route path='profile' element={<AdminProfile />} />
            <Route path='users' element= {<Users />} />
            <Route path='drivers' element={<Drivers />} />
            <Route path='driver/:id' element={<DriverDetails />} />
            <Route path='payments' element={<Payments />} />
            <Route path='logout' element={<AdminLogout />} />
          </Route>

          <Route path="/dashboard/driver/" element={<LayoutDriver />} >
            <Route index element={<DriverDashboard />} />
            <Route path='profile' element={<DriverProfile />} />
            <Route path='calendar' element={<DriverCalender />} />
            <Route path='trip-history' element= {<History />} />
            <Route path='logout' element={<DriverLogout />} />
          </Route>


          {/*<Route path="/profile/user/:token" element={<ProfilePage />} />*/}
	  <Route path="/" element={<Homepage />} />
	  <Route path="/become-driver" element={<BecomeDriver />} />
	  <Route path="/about" element={<AboutUs />} />
	  <Route path="/faqs" element={<FAQPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
     
    </Router>
    
  );
}

export default App;
