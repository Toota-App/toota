import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiTimeLine, RiRoadMapLine } from 'react-icons/ri';
import { FaHandshake } from 'react-icons/fa';

const BecomeDriver = () => {
  return (
    <section className="become-driver shadow-md rounded overflow-hidden">
      <div className="flex items-center justify-center mb-6"> {/* Adjusted alignment */}
        <div className="text-center"> {/* Centered heading */}
          <h2 className="text-4xl font-bold mb-0">BECOME A TOOTA DRIVER</h2> {/* Heading */}
        </div>
      </div>
      <div className="benefits p-8 bg-gray-100">
        <h3 className="text-2xl font-bold mb-6 text-blue-500">BENEFITS</h3>
        <div className="flex flex-wrap justify-center items-center space-x-4">
          <div className="benefit w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MdOutlineAttachMoney className="text-blue-500 text-2xl mr-2" />
              <h4 className="text-xl font-semibold mb-0">Earn Additional Income</h4>
            </div>
            <p className="text-gray-700">
              Joining the Toota Team is free – you only pay Toota a commission
              once work is accepted and completed.
            </p>
          </div>
          <div className="benefit w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <RiTimeLine className="text-blue-500 text-2xl mr-2" />
              <h4 className="text-xl font-semibold mb-0">Drive When You Want</h4>
            </div>
            <p className="text-gray-700">
              Flexible working hours. Work whenever it suits you and only
              accept the jobs you want to do.
            </p>
          </div>
          <div className="benefit w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FaHandshake className="text-blue-500 text-2xl mr-2" />
              <h4 className="text-xl font-semibold mb-0">Choose Your Jobs</h4>
            </div>
            <p className="text-gray-700">
              No haggling from customers – there's a set price. Your marketing,
              sales, and IT platform will be taken care of.
            </p>
          </div>
          <div className="benefit w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <RiRoadMapLine className="text-blue-500 text-2xl mr-2" />
              <h4 className="text-xl font-semibold mb-0">Boost Your Driving Experience</h4>
            </div>
            <p className="text-gray-700">
              Explore new routes and meet interesting people. Toota enhances
              your driving experience with diverse job opportunities.
            </p>
          </div>
        </div>
      </div>
      <div className="join-toota p-8 bg-green-500 text-white rounded">
        <h3 className="text-2xl font-bold mb-4">Join The Toota Team</h3>
        <p className="text-xl leading-relaxed mb-8">
          Join the Toota team to get more driving jobs today. Fill out our
          application form – it's easy and we'll get back to you.
        </p>
        <Link to="/signup/driver">
          <button className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 focus:outline-none">
            Apply Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default BecomeDriver;

