import React from 'react';
import becomeDriverImage from "../../assets/becomeDriver.jpg";
 

const BecomeDriver = () => {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      {/* Image Section */}
      <div className="mb-6">
        <img src={becomeDriverImage} alt="Become a Toota Driver" className="mx-auto w-3/4" />
      </div>

      {/* Information Section */}
      <div className="text-yellow-500">
        <h2 className="text-2xl font-bold mb-4">BECOME A TOOTA DRIVER</h2>
        <p className="mb-4">
          Join The Toota Team to make extra money driving. Fill out our application form – it’s easy, and we’ll get back to you.
        </p>
	  {/* Benefits Section */}
<div className="bg-yellow-500 text-black p-4 rounded mb-8">
  <h3 className="text-xl font-bold mb-4">BENEFITS</h3>
  <div className="flex space-x-4">
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
      <h4 className="font-semibold">01. Earn additional income</h4>
      <p>Joining the Toota Team is free – you only pay Toota a commission once work is accepted and completed.</p>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
      <h4 className="font-semibold">02. Drive when you want</h4>
      <p>Flexible working hours. Work whenever it suits you and only accept the jobs you want to do.</p>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
      <h4 className="font-semibold">03. Choose your jobs</h4>
      <p>No haggling from customers – there’s a set price. Your marketing, sales, and IT platform will be taken care of.</p>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
      <h4 className="font-semibold">04. Boost your driving experience</h4>
      <p>Explore new routes and meet interesting people. Toota enhances your driving experience with diverse job opportunities.</p>
    </div>
  </div>
</div>



        {/* Join the Toota Team Section */}
        <div className="bg-white text-black p-4 rounded">
          <h3 className="text-xl font-bold mb-2">Join The Toota Team</h3>
          <p>
            Join the Toota team to get more driving jobs today. Fill out our application form – it’s easy and we’ll get back to you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BecomeDriver;


