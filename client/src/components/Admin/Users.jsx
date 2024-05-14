import React, { useEffect, useState, Suspense} from 'react'
import { getAllUsers, getAllDrivers } from '../../services/AuthService';

function Users() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const user = await getAllUsers();
        setUser(user['users'])
        console.log(user)
        setIsLoading(false);
        
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);
  
  return (
     <div className="flex justify-start items-center flex-col gap-4">
      {isLoading ? (
        <div className="flex items-center h-full">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
            <div className="flex flex-wrap w-full h-full">
      <div className="w-full max-w-full  mt-0 mb-4  lg:mb-0 lg:w-full lg:flex-none">
        <div className="relative flex flex-col min-w-0 break-words bg-white  shadow-xl dark:bg-slate-850 dark:shadow-dark-xl dark:bg-gray-950 border-black-125 rounded-2xl bg-clip-border">
          <div className="p-4 pb-0 mb-0 rounded-t-4">
            <div className="flex justify-between">
              <h6 className="mb-2 dark:text-white">All Users</h6>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="items-center w-full mb-4 align-top  ">
              <tbody>
                {user && Object.keys(user).map((id, index) => (
                  <tr key={index}>
                    <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40">
                      <div className="text-center">
                        <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60">Full Name:</p>
                        <h6 className="mb-0 text-sm leading-normal dark:text-white">{user[id].full_name}</h6>
                      </div>
                    </td>
                    <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40">
                      <div className="text-center">
                        <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60">Email:</p>
                        <h6 className="mb-0 text-sm leading-normal dark:text-white">{user[id].email}</h6>
                      </div>
                    </td>
                    <td className="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40">
                      <div className="flex-1 text-center">
                        <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60">Phone Number:</p>
                        <h6 className="mb-0 text-sm leading-normal dark:text-white">{user[id].phone_number}</h6>
                      </div>
                    </td>
                    
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      )}
    </div>
    
  )
}

export default Users