import React from 'react';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
    return (
        <div>
            <Helmet>
                <title>About Us - Toota</title>
                <meta 
                    name="description" 
                    content="Learn more about Toota, a revolutionary digital platform connecting you with a diverse fleet of vehicles and experienced drivers for seamless transportation solutions."
                />
            </Helmet>
            <Header />
            <img 
                src="https://cf.ltkcdn.net/family/images/std/200821-800x533r1-family.jpg" 
                alt="Team working together" 
                className="w-full h-auto object-cover"
            />
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8">About Toota</h1>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Welcome to Toota, your trusted partner in logistics and transportation. We are a cutting-edge digital platform designed to streamline the process of connecting customers with a diverse fleet of vehicles and experienced drivers. Our mission is to revolutionize the logistics industry by offering a seamless and reliable transportation experience for individuals and businesses alike.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        At Toota, we understand the challenges of finding reliable transportation and the importance of efficiency in logistics. That’s why we have built a platform that prioritizes ease of use, reliability, and transparency. Our user-friendly interface allows you to quickly and easily book transportation services, while our robust system ensures that your needs are met with the utmost professionalism.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Our diverse fleet includes a range of vehicles to suit various needs, from small vans to large trucks. Whether you're moving goods across town or across the country, Toota provides the right vehicle for the job. Our experienced drivers are committed to delivering top-notch service, ensuring that your transportation experience is smooth and hassle-free.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Toota is more than just a transportation service; we are a community of dedicated professionals working together to meet your logistics needs. Our team is passionate about what we do and continuously strives to improve our services to better serve our customers.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Our platform supports a wide range of services including on-demand transportation, scheduled deliveries, and more. We are committed to innovation and continuously seek ways to enhance our offerings to better serve our clients. 
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Thank you for choosing Toota. We look forward to serving you and making your transportation experience as efficient and pleasant as possible. If you have any questions or need assistance, please don't hesitate to <a href="mailto:info@toota.com" className="text-[#f89f1b] hover:underline">contact us</a>.
                    </p>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default AboutUs;
            
