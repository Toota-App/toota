import React, { useEffect, useState } from 'react';
import { getUser } from '../../../services/AuthService';
import { Popover, Transition, Menu } from '@headlessui/react';
import { Fragment } from 'react'
import { HiOutlineBell } from 'react-icons/hi'
import { CgProfile } from "react-icons/cg";
import { useNavigate} from 'react-router-dom';
import classNames from 'classnames'


export default  function Header(){
	const [user, setUser] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();
	useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const jwt = localStorage.getItem('access_token');
        
        if (jwt) {
          const response =  await getUser()
          
          setUser(response);
        } else {
          setErrorMessage('No authentication token available');
        }
        
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to fetch user profile data. Please try again.');
        
      }
    };

    fetchUserProfile();
  }, []);
	
	console.log(user)


	return (
		<header className='bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200'>
			<div className="relative">Dashboard</div>
			<div className="flex items-center gap-2 mr-2">
				<Popover className="relative">
			        {({ open }) => (
			          <>
			            <Popover.Button
			              className={classNames(open && 'bg-gray-100',' rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100: focus:outline-none active:bg-gray-100')}
			            >
			            <HiOutlineBell fontSize={24}/>
				
			            </Popover.Button>
			             <Transition
			              as={Fragment}
			              enter="transition ease-out duration-200"
			              enterFrom="opacity-0 translate-y-1"
			              enterTo="opacity-100 translate-y-0"
			              leave="transition ease-in duration-150"
			              leaveFrom="opacity-100 translate-y-0"
			              leaveTo="opacity-0 translate-y-1"
			            >
			            <Popover.Panel className="absolute right-0 z-10 mt-3.5 w-40">
			            	<div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5 '>
			            		<strong className='text-gray-700 font-medium'> Notifications</strong>
			            		<div className='mt-2 py-1 text-sm'>no notifications</div>
			            	</div>
			            </Popover.Panel>
			            </Transition>
			           </>
			        )}
			        </Popover>
			        <Menu as="div" className="relative ">
				        <div>
				          <Menu.Button className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400">
				          		<span className="sr-only">open user menu</span>
				          		<div className="rounded-full "
				          		>
				          		<CgProfile  fontSize={24}/>


				          		</div>
				            </Menu.Button>
				            
				        </div>
				  		<Transition
				          as={Fragment}
				          enter="transition ease-out duration-100"
				          enterFrom="transform opacity-0 scale-95"
				          enterTo="transform opacity-100 scale-100"
				          leave="transition ease-in duration-75"
				          leaveFrom="transform opacity-100 scale-100"
				          leaveTo="transform opacity-0 scale-95"
				        >
		          		<Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-sm p-1 bg-white ring-1 ring-black ring-opacity-5  focus:outline-none">
		            		
				              <Menu.Item>
				                {({ active }) => (
				                  <div  className={classNames(open && "bg-gray-100","text-gray-700 focus:bg-gray-200 cursor-pointer rounded-sm px-4 py-2")} onClick={() => navigate('/dashboard/user/profile')}>
				                   Your Profile
				                  </div>
				                )}
				              </Menu.Item>
				              <Menu.Item>
				                {({ active }) => (
				                  <div  className={classNames(open && "bg-gray-100","text-gray-700 focus:bg-gray-200 cursor-pointer rounded-sm px-4 py-2")} onClick={() => navigate('/dashboard/user/logout')}>
				                   Logout
				                  </div>
				                )}
				              </Menu.Item>
				            
				        </Menu.Items>
				    </Transition>
				    </Menu>
					
			</div>
			
		</header>
	);
}