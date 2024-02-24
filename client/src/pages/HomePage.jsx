// src/pages/HomePage.jsx

import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto mt-10 p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-indigo-600">Welcome to Toota!</h1>
      <p className="text-lg text-gray-700">
        Toota is your one-stop solution for all your transportation needs.
      </p>
      <div className="mt-8">
        <p className="text-md text-gray-600">
          Whether you need a ride or want to become a driver, Toota has you covered.
        </p>
        <p className="text-md text-gray-600">
          Explore our services and join us in creating a seamless transportation experience.
        </p>
      </div>
    </div>
  );
};

export default Home;

