// Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png';
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-yellow-500 p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* App Icon Placeholder (Replace with your actual icon) */}
        <div className="flex items-center">
          <img
            className="h-8 w-auto mr-2"
            src={logo}
            alt="App Icon"
          />
          <span className="text-xl font-bold text-brown">Toota</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Business Services
          </Link>
          <Link to="/services" className="text-white hover:text-gray-300">
            Services
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300">
            About Toota
          </Link>
          <Link to="/become-driver" className="text-white hover:text-gray-300">
            Become a Driver
          </Link>
          <Link to="/signup/user" className="text-white hover:text-gray-300">
            Sign up
          </Link>
          <Link to="/login/user" className="text-white hover:text-gray-300">
            Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        {/* ... (same as before) ... */}
      </Dialog>
    </header>
  );
};

export default Header;

