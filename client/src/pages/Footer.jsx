import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#404042] text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">About Toota</h3>
                        <p className="text-sm">
                            Toota is your ultimate solution for seamless transportation and logistics services. Connect with a diverse fleet of vehicles and experienced drivers to meet all your transportation needs.
                        </p>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-[#f89f1b]">Home</Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-[#f89f1b]">About Us</Link>
                            </li>
                            <li>
                                <Link to="/become-driver" className="hover:text-[#f89f1b]">Become a Driver</Link>
                            </li>
                            <li>
                                <Link to="/faqs" className="hover:text-[#f89f1b]">FAQs</Link>
                            </li>
                        </ul>
                    </div>
                    {/* Contact and Social Media */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                        <div className="mb-4">
                            <a href="mailto:info@tootapp.co.za" className="flex items-center hover:text-[#f89f1b]">
                                <FaEnvelope className="text-xl mr-2" />
                                <span>info@tootapp.co.za</span>
                            </a>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-[#f89f1b]">
                                <FaFacebook className="text-2xl" />
                            </a>
                            <a href="#" className="hover:text-[#f89f1b]">
                                <FaTwitter className="text-2xl" />
                            </a>
                            <a href="#" className="hover:text-[#f89f1b]">
                                <FaInstagram className="text-2xl" />
                            </a>
                            <a href="#" className="hover:text-[#f89f1b]">
                                <FaLinkedin className="text-2xl" />
                            </a>
                        </div>
                    </div>
                </div>
                {/* Footer Bottom */}
                <div className="mt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Toota. All Rights Reserved.</p>
                    <Link to="/privacy-policy" className="hover:text-[#f89f1b]">Privacy Policy</Link> | 
                    <Link to="/terms-of-service" className="hover:text-[#f89f1b]"> Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
                    
