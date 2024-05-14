import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import { FaBolt, FaTruck, FaFileAlt, FaHandshake, FaUserFriends, FaCalendarAlt, FaMapMarkedAlt } from 'react-icons/fa'; // Import icons for services

const Homepage = () => {
    return (
        <div>
            <Header /> {/* Include the Header component */}
            <div className="bg-gradient-to-b from-black to-black text-white h-screen flex items-center justify-center">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Welcome Message and Paragraph */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-4">Welcome to Toota</h1>
                        <p className="text-lg mb-8">Your ultimate solution for seamless transportation and logistics services.</p>
                        <p className="text-lg mb-8">With Toota, you can effortlessly connect with a diverse fleet of vehicles and experienced drivers to meet all your transportation needs. Whether you're moving goods or seeking a ride, Toota ensures a reliable, efficient, and hassle-free experience every time.</p>
                        <p className="text-lg mb-8">Join Toota today and experience the future of transportation!</p>

                        {/* Bolt Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} // Initial animation values
                            animate={{ opacity: 1, y: 0 }} // Animation to trigger when component mounts
                            transition={{ delay: 0.5, duration: 1 }} // Transition properties
                        >
                            <FaBolt className="text-yellow-400 text-4xl animate-bounce" /> {/* Bolt icon with animation */}
                        </motion.div>
                    </div>
                    {/* Hero Image */}
                    <div className="hidden md:block">
                        <img src="https://aeshippingltd.com/wp-content/uploads/2020/01/tr-2-opt.jpg" alt="Hero" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
            {/* Featured Services Section */}
            <section className="bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Featured Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Diverse Fleet */}
                        <div className="flex items-center justify-center flex-col">
                            <FaTruck className="text-5xl mb-4 text-blue-500" />
                            <h3 className="text-xl font-semibold mb-2">Diverse Fleet</h3>
                            <p className="text-gray-700 text-center">Access a variety of vans and trucks to meet your transportation needs.</p>
                        </div>
                        {/* Standard Form */}
                        <div className="flex items-center justify-center flex-col">
                            <FaFileAlt className="text-5xl mb-4 text-blue-500" />
                            <h3 className="text-xl font-semibold mb-2">Standard Form</h3>
                            <p className="text-gray-700 text-center">Fill out a standard form to provide details about your transportation requirements.</p>
                        </div>
                        {/* Negotiate */}
                        <div className="flex items-center justify-center flex-col">
                            <FaHandshake className="text-5xl mb-4 text-blue-500" />
                            <h3 className="text-xl font-semibold mb-2">Negotiate</h3>
                            <p className="text-gray-700 text-center">Negotiate the price with drivers to ensure a fair deal for both parties.</p>
                        </div>
                        {/* New Featured Service */}
                        <div className="flex items-center justify-center flex-col">
                            <FaUserFriends className="text-5xl mb-4 text-blue-500" />
                            <h3 className="text-xl font-semibold mb-2">Peer-to-Peer Rating</h3>
                            <p className="text-gray-700 text-center">Rate and review drivers based on your experience to help others make informed choices.</p>
                        </div>
                        {/* New Featured Service */}
                        <div className="flex items-center justify-center flex-col">
                            <FaCalendarAlt className="text-5xl mb-4 text-blue-500" />
                            <h3 className="text-xl font-semibold mb-2">Upcoming Jobs</h3>
                            <p className="text-gray-700 text-center">View and manage your upcoming jobs with ease using our integrated calendar.</p>
                        </div>
                        {/* New Featured Service */}
                        <div className="flex items-center justify-center flex-col">
                            <FaMapMarkedAlt className="text-5xl mb-4 text-blue-500" />
                            <h3 className="text-xl font-semibold mb-2">Explore New Routes</h3>
                            <p className="text-gray-700 text-center">Discover new routes and expand your horizons with our integrated mapping feature.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Driver Section */}
            <section className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="hidden md:block">
                        <img src="https://img.freepik.com/premium-photo/happy-smiling-truck-driver-sitting-his-truck-created-with-generative-ai-technology_132358-11849.jpg" alt="Driver" className="w-full h-full object-cover rounded-md" />
                    </div>
                    {/* Text Section */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-4">Drive When You Want</h2>
                        <p className="text-lg mb-8">Make what you need with Toota's flexible schedule. Whether you're looking to earn extra income or make a living, Toota gives you the freedom to choose when and where you work.</p>
                        <a href="/signup/driver" className="bg-black text-white px-4 py-2 rounded-full focus:outline-none mb-4 w-32">Get Started</a>
                        <p className="text-sm">Already have an account? <a href="/login/driver" className="text-blue-400 hover:underline">Login</a></p>
                    </div>
                </div>
            </section>
	    <Footer />
        </div>
    );
};

export default Homepage;

