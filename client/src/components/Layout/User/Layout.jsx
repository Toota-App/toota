import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'


function Layout() {
  return (
    <div className="flex flex-row bg-gray-100 h-screen w-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <div className='p-4'>{<Outlet />}</div>
        </div>
    </div>
  )
}

export default Layout