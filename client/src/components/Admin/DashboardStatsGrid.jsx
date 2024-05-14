import React, { useEffect, useState } from 'react';
import { IoBagHandle, IoPieChart, IoPeople, IoCart } from 'react-icons/io5'
import { FaUsers } from "react-icons/fa6";
import { IoCarSportSharp } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { CiDeliveryTruck } from "react-icons/ci";


function DashboardStatsGrid({ userCount, driverCount,tripInProgressCount,tripCompletedCount }) {

  return (
   
        <div className="flex gap-4 w-full mb-5">
          <BoxWrapper>
            <div className="flex justify-center items-center w-12 h-12 bg-gray-500 rounded-full">
              <FaUsers className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm font-light text-gray-500">Registered Users</span>
              <div>
                <strong className="text-xl font-semibold text-gray-500">{userCount}</strong>
              </div>
            </div>
          </BoxWrapper>
          {/* Include other BoxWrapper components here */}
          <BoxWrapper>
            <div className='flex justify-center items-center w-12 h-12 bg-yellow-500 rounded-full'>
                <IoCarSportSharp  className='text-2xl text-white'/>
            </div>
            <div className='pl-4'>
                <span className='text-sm font-light text-gray-500'>Registered Drivers</span>
                <div>
                    <strong className="text-xl font-semibold text-gray-500">{driverCount}</strong>
                </div>
            </div>
        </BoxWrapper>
        <BoxWrapper>
            <div className='flex justify-center items-center w-12 h-12 bg-green-500 rounded-full'>
                <TbTruckDelivery  className='text-2xl text-white'/>
            </div>
            <div className='pl-4'>
                <span className='text-sm font-light text-gray-500'>Trips In Progress</span>
                <div>
                    <strong className="text-xl font-semibold text-gray-500">{tripInProgressCount}</strong>
                </div>
            </div>
        </BoxWrapper>
        <BoxWrapper>
            <div className='flex justify-center items-center w-12 h-12 bg-blue-500 rounded-full'>
                <CiDeliveryTruck  className='text-2xl text-white'/>
            </div>
            <div className='pl-4'>
                <span className='text-sm font-light text-gray-500'>Trips Completed</span>
                <div>
                    <strong className="text-xl font-semibold text-gray-500">{tripCompletedCount}</strong>
                </div>
            </div>
        </BoxWrapper>
        </div>
  );
}

export default DashboardStatsGrid;

function BoxWrapper({ children }) {
  return <div className="flex flex-1 items-center p-4 bg-white rounded-sm border border-gray-200">{children}</div>;
}
