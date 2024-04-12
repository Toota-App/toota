import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi'; // Import the alert circle icon from react-icons library

const SessionExpiredBanner = () => {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <FiAlertCircle className="h-6 w-6 mr-2 text-red-500" />
          <p className="text-red-700">Your session has expired. Please login again.</p>
        </div>
        <div className="mt-4">
          <Link to="/login/user">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredBanner;

