import React , { useState } from 'react'
import { ADMIN_DASHBOARD_BOTTOM_LINKS, ADMIN_DASHBOARD_LINKS } from '../../../lib/utils/navigation';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../../assets/logo.png";

import classNames from 'classnames'

const linkStyles = 'flex items-center gap-2 py-2 hover:bg-gray-700 hover:no-underline active:bg-gray-600 rounded-sm text-base';

export default function SidebarAdmin() {
  const [isExpanded, setIsExpanded] = useState(false); // Initial expanded state

  const toggleSidebar = () => setIsExpanded(!isExpanded); // Function to toggle sidebar

  return (
    <div
      className={classNames(
        'bg-[#414043] p-3 text-white flex flex-col transition duration-300 ease-in-out',
        isExpanded ? 'w-60' : 'w-16' // Conditional width based on expanded state
      )}
    >
      <div className="flex items-center gap-2 px-1 py-2">
        <img src={logo} className="object-fit mx-auto w-2/4" alt="logo" />
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      <div
        className={classNames(
          'flex-1 py-8 flex flex-col gap-0.5',
          !isExpanded && 'text-gray-400' // Dim text on collapse
        )}
      >
        {ADMIN_DASHBOARD_LINKS.map((item) => (
          <SideBarAdminLink key={item.key} item={item} isExpanded={isExpanded} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700 cursor-pointer">
        {ADMIN_DASHBOARD_BOTTOM_LINKS.map((item) => (
          <SideBarAdminLink key={item.key} item={item} isExpanded={isExpanded} />
        ))}
      </div>
    </div>
  );
}

const SideBarAdminLink = ({ item, isExpanded }) => {
  const { pathname } = useLocation();

  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path ? 'bg-green-100' : 'text-gray-100',
        linkStyles
      )}
    >
      <span className="text-xl">{item.icon}</span>
      {isExpanded && item.label} {/* Only show label on expanded state */}
    </Link>
  );
};


