import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBarDriver  from './SideBarDriver'
import Header from './Header';

function LayoutDriver() {
  return (
    <div className="flex flex-row bg-gray-100 h-screen w-screen overflow-hidden">
        <SideBarDriver />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <div className='p-4'>{<Outlet />}</div>
        </div>
    </div>
  )
}

export default LayoutDriver