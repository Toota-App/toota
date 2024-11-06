import React, { useState } from 'react';
import { DASHBOARD_DRIVER_LINKS, DASHBOARD_DRIVER_BOTTOM_LINKS } from '../../../lib/utils/navigation';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../../assets/logo.png";

import classNames from 'classnames';

const linkStyles = 'flex items-center gap-2 py-2 rounded-sm text-base';

export default function SideBarDriver() {
  const [isExpanded, setIsExpanded] = useState(true); // Initial expanded state

  const toggleSidebar = () => setIsExpanded(!isExpanded); // Function to toggle sidebar

  return (
    <div>
      <div className={classNames(
        "flex gap-2 justify-start items-center py-2 bg-[#414043] text-white",
        'lg:flex-col',
      )}>
        <Link to='/'>
          <img src={logo} className={classNames(
            "object-fit h-12",
            'lg:w-16 lg:h-16',
          )} alt="logo" />
        </Link>
        <button onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={classNames(
              'h-6 w-6 text-white',
              'hidden',
              'lg:block',
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>  
      </div>
      <div
        className={classNames(
          'text-white flex flex-col transition-all duration-300 ease-in-out',
          'fixed bottom-0 w-full',
          `lg:relative lg:h-full lg:bg-[#414043] ${isExpanded ? 'lg:w-28' : 'lg:w-16'}`,
        )}
      >
        <div
          className={classNames(
            'flex justify-between items-center px-4 py-3',
            'md:px-8',
            'lg:flex-1 lg:py-8 lg:flex-col lg:justify-start',
            !isExpanded && 'text-gray-400', // Dim text on collapse
          )}
        >
          {DASHBOARD_DRIVER_LINKS.map((item) => (
            
              <SideBarDriverLink key={item.key} item={item} isExpanded={isExpanded} />
            
          ))}
        </div>
      </div>
    </div>
  );
}

const SideBarDriverLink = ({ item, isExpanded }) => {
  const { pathname } = useLocation();
  console.log(pathname, item.path)

  return (
    <Link
      to={item.path}
      className={classNames(
        'flex flex-col',
        (
          // Apply effects to dashboard menu item when the driver visits dashboard
          (pathname.substring(pathname.lastIndexOf('/') + 1) === 'driver' && item.path === '')
          ||
          // Apply effects to apropriate menu item the driver selects
          pathname.substring(pathname.lastIndexOf('/') + 1 ) === item.path
        ) ? 'text-black font-bold lg:font-normal transition-all duration-500 lg:text-white'
        : 'text-gray-500 scale-95 duration-500 lg:text-[#b1a7a6] lg:hover:text-[#d9cdcb]',
        linkStyles
      )}
    >
      <span className="text-xl">{item.icon}</span>
      {isExpanded && item.label} {/* Only show label on expanded state */}
    </Link>
  );
};

