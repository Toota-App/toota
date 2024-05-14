import React from 'react'
import { Outlet } from 'react-router-dom';
import SidebarAdmin from "./SideBarAdmin"
import Header from './Header';

function LayoutAdmin() {
  return (
    <div className="flex flex-row bg-gray-100 h-screen w-screen overflow-hidden">
        <SidebarAdmin />
        <div className="flex flex-col flex-1">
          <Header />
          <div className='flex-1 p-4 min-h-0 overflow-auto"'>{<Outlet />}</div>
        </div>
    </div>
  )
}

export default LayoutAdmin