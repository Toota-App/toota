import React, { useState, useEffect } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { BellIcon, HomeIcon, UserIcon, MailIcon, CogIcon, LogoutIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';  // Import jwt-decode library

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
  { name: 'Home', href: '#', current: true, icon: HomeIcon },
  { name: 'Profile', href: '#', current: false, icon: UserIcon },
  { name: 'Ride History', href: '#', current: false, icon: MailIcon },
  { name: 'Notifications', href: '#', current: false, icon: BellIcon },
  { name: 'Settings', href: '#', current: false, icon: CogIcon },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Logout', href: '#', icon: LogoutIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if token has expired
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        // Token has expired, redirect to login
        navigate('/login/user');
      }
    } else {
      // Token not found, redirect to login
      navigate('/login/user');
    }
  }, [navigate]);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirmation = (confirmLogout) => {
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/login/user');
    }
    setShowLogoutConfirmation(false);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Disclosure as="nav" className="bg-gray-800 w-64">
        {({ open }) => (
          <>
            <div className="px-4 py-3">
              <h1 className="text-3xl font-bold text-yellow-500">TOOTA</h1>
            </div>
            <div className="mt-5 pb-1 border-t border-gray-700">
              <div className="ml-2 text-gray-200 text-sm">Navigation</div>
              <div className="mt-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      activeLink === item.name && 'border-b-2 border-yellow-500'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={() => setActiveLink(item.name)}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-300',
                        'mr-3 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-64 pb-1 border-b border-gray-700">
              <div className="px-4">
                <div className="mt-5">
                  <div className="ml-2 text-gray-200 text-sm">Account</div>
                  <div className="mt-2 space-y-1">
                    {userNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          'group flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md',
                          activeLink === item.name && 'text-yellow-500'
                        )}
                        onClick={() => {
                          if (item.name === 'Logout') {
                            handleLogout();
                          } else {
                            setActiveLink(item.name);
                          }
                        }}
                      >
                        {item.icon && (
                          <item.icon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                        )}
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow flex items-center justify-between px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {/* Profile Image */}
          <div className="relative">
            <button
              className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-gray-200 focus:outline-none"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <img className="rounded-full" src={user.imageUrl} alt={user.name} />
            </button>

            {/* Profile Dropdown */}
            <Transition
              show={profileDropdownOpen}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  {userNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </Transition>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            {/* Your content goes here */}
          </div>
        </main>
      </div>

      {/* Render LogoutConfirmationForm if showLogoutConfirmation is true */}
      {showLogoutConfirmation && (
        <LogoutConfirmationForm onConfirm={handleLogoutConfirmation} />
      )}
    </div>
  );
}

