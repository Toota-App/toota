import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
    return (
        <div>
            <Header />
            <img src="https://cf.ltkcdn.net/family/images/std/200821-800x533r1-family.jpg" alt="Hero" className="w-full h-auto object-cover" />
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Toota is a digital platform revolutionizing the logistics industry by connecting customers with a diverse fleet of vehicles and experienced drivers. Our platform ensures a seamless transportation experience for all. Toota is committed to providing reliable, efficient, and hassle-free transportation solutions to meet your needs.
                    </p>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default AboutUs;

