// Footer.jsx

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white text-[#404042] py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Social Media Links */}
                    <div className="col-span-2 md:col-span-3 flex items-center justify-center md:justify-start">
                        <a href="#" className="mr-4">
                            <FaFacebook className="text-2xl hover:text-[#f89f1b]" />
                        </a>
                        <a href="#" className="mr-4">
                            <FaTwitter className="text-2xl hover:text-[#f89f1b]" />
                        </a>
                        <a href="#" className="mr-4">
                            <FaInstagram className="text-2xl hover:text-[#f89f1b]" />
                        </a>
                        <a href="#" className="mr-4">
                            <FaLinkedin className="text-2xl hover:text-[#f89f1b]" />
                        </a>
                    </div>
                    {/* Contact Info */}
                    <div className="col-span-2 md:col-span-2 flex items-center justify-center md:justify-end">
                        <a href="mailto:info@toota.com" className="flex items-center">
                            <FaEnvelope className="text-xl mr-2" />
                            <span>info@tootapp.co.za</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

