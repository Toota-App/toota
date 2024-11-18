import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#404042] shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link aria-label="Visit the homepage" to="/"><img aria-hidden="true" src={logo} alt="Toota icon to redirect to homepage" className="h-16" /></Link>
          </div>
          {/* Navigation Links (centered on large screens) */}
          <div className="hidden md:flex flex-grow justify-center space-x-4">
            <Link aria-label="Visit the homepage" to="/" className="text-white hover:text-[#f89f1b]">Home</Link>
            <Link aria-label="Read about the company" to="/about" className="text-white hover:text-[#f89f1b]">About Us</Link>
            <Link aria-label="Sign up as a driver" to="/become-driver" className="text-white hover:text-[#f89f1b]">Become a Driver</Link>
          </div>
          {/* Login and Signup Buttons (shown on large screens) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link aria-label="Log in as a user to start creating trips" to="/login/user" className="px-4 py-2 rounded-md bg-[#f89f1b] text-black hover:bg-gray-300 transition-colors duration-300">
              Login
            </Link>
            <Link aria-label="Sign up as a user" to="/signup/user" className="px-4 py-2 rounded-md bg-transparent text-white border border-white hover:bg-white hover:text-black transition-colors duration-300">
              Sign Up
            </Link>
          </div>
          {/* Mobile Navigation */}
          <button aria-label="Expand menu bar" onClick={toggleMenu} className="md:hidden focus:outline-none">
            <svg aria-hidden="true"
              className="h-6 w-6 text-white hover:text-[#f89f1b]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden bg-[#404042] text-white shadow-md transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="py-2 px-4 space-y-2">
            <li>
              <Link to="/" className="block py-2 hover:text-[#f89f1b]">Home</Link>
            </li>
            <li>
              <Link to="/about" className="block py-2 hover:text-[#f89f1b]">About Us</Link>
            </li>
            <li>
              <Link to="/become-driver" className="block py-2 hover:text-[#f89f1b]">Become a Driver</Link>
            </li>
            <li>
              <Link to="/login/user" className="block py-2 hover:text-[#f89f1b]">Login</Link>
            </li>
            <li>
              <Link to="/signup/user" className="block py-2 hover:text-[#f89f1b]">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;

