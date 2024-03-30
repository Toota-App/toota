import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa'; // Importing required icons

const UserRegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const clearMessages = setTimeout(() => {
      setSuccessMessage('');
      setErrors({});
    }, 5000); // Clear messages after 5 seconds

    return () => clearTimeout(clearMessages);
  }, [successMessage, errors]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setTimeout(() => {
      setShowPassword(false);
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.trim().length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password.trim())) {
      newErrors.password = 'Password must contain at least one special symbol';
    }

    if (formData.confirmPassword.trim() !== formData.password.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm(formData)) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/sign_up/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            email: formData.email,
            password1: formData.password,
            password2: formData.confirmPassword,
          }),
        });

        if (response.status === 201) {
          setSuccessMessage('Registration successful! Please check your email to verify.');
          setFormData({
            fullName: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
        } else if (response.status === 500) {
          setErrors({ generic: 'Internal Server Error. Please try again later.' });
        } else {
          const errorData = await response.json();
          if (response.status === 400) {
            setErrors({ generic: 'Bad request. Please check your input and try again.' });
          } else {
            setErrors(errorData);
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ generic: 'An error occurred. Please try again later.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-2/3 lg:w-1/2 xl:w-1/3" onSubmit={handleSubmit} method="post">
        <h2 className="text-2xl mb-6 font-bold text-center">Sign Up</h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            {successMessage}
          </div>
        )}

        {errors.generic && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {errors.generic}
          </div>
        )}

        <div className="mb-4 flex items-center">
          <FaUser className="text-gray-500 mr-2" />
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.fullName && 'border-red-500'}`}
            id="fullName"
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="current-fullName"
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-lg italic ml-7">{errors.fullName}</p>}

        <div className="mb-4 flex items-center">
          <FaPhone className="text-gray-500 mr-2" />
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.phoneNumber && 'border-red-500'}`}
            id="phoneNumber"
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            autoComplete="current-phoneNumber"
          />
        </div>
        {errors.phoneNumber && <p className="text-red-500 text-lg italic ml-7">{errors.phoneNumber}</p>}

        <div className="mb-4 flex items-center">
          <FaEnvelope className="text-gray-500 mr-2" />
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.email && 'border-red-500'}`}
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="current-email"
          />
        </div>
        {errors.email && <p className="text-red-500 text-lg italic ml-7">{errors.email}</p>}

        <div className="mb-4 relative flex items-center">
          <FaLock className="text-gray-500 mr-2" />
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.password && 'border-red-500'}`}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <span
            className="text-gray-600 absolute right-0 mr-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>
        {errors.password && <p className="text-red-500 text-lg italic ml-7">{errors.password}</p>}

        <div className="mb-4 flex items-center">
          <FaLock className="text-gray-500 mr-2" />
          <input
            className={`appearance-none border rounded w-full py-2 px-3 ${errors.confirmPassword && 'border-red-500'}`}
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-lg italic ml-7">{errors.confirmPassword}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-black hover:bg-gray-800 mt-6"
        >
          Register Your Account
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login/user" className="text-blue-500 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;

