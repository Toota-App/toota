import "./App.css";
import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DriverRegistrationForm from "./components/Driver/DriverRegistrationForm";
import DriverLoginForm from "./components/Driver/DriverLoginForm";
import UserLoginForm from "./components/User/UserLoginForm";
import UserRegistrationForm from "./components/User/UserRegistrationForm";
import ForgotPasswordForm from "./components/User/ForgotPasswordForm";
import NotFound from "./pages/NotFound";
import Header from './components/navigation/header';
import BecomeDriver from './components/navigation/BecomeDriver';
import HomePage from './pages/HomePage';
export const AuthContext = createContext();

function App() {
  const [jwt, setJWT] = useState(null);

  return (
    <Router>
      <AuthContext.Provider value={{ auth: [jwt, setJWT] }}>
        <div>
          <Header />
          <Routes>
            <Route path="/signup/driver" element={<DriverRegistrationForm />} />
            <Route path="/login/driver" element={<DriverLoginForm />} />
            <Route path="/signup/user" element={<UserRegistrationForm />} />
            <Route path="/login/user" element={<UserLoginForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
	     <Route path="/become-driver" element={<BecomeDriver />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;

