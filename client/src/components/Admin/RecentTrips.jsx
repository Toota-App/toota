import * as React from 'react';

export default function RecentTrips({ trips }) {
  return (
    <div className="flex flex-wrap w-full h-full overflow-y-auto">
      <div className="w-full max-w-full  mt-0 mb-6  lg:flex-none">
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl dark:bg-gray-950 border-black-125 rounded-2xl bg-clip-border">
          <div className="p-4 pb-0 mb-0 rounded-t-4">
            <div className="flex justify-between">
              <h6 className="mb-2 dark:text-white">Recent Trips</h6>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="items-center w-full mb-4 align-top border-collapse border-gray-200 dark:border-white/40">
              <tbody>
                {trips && Object.keys(trips).slice(0, 5).map((id, index) => (
                  <tr key={index}>
                    <td className="p-2 align-middle bg-transparent border-b w-3/10 whitespace-nowrap dark:border-white/40">
                      <div className="flex items-center px-2 py-1">
                        <div className="ml-6">
                          <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60">Pickup Location:</p>
                          <h6 className="mb-0 text-sm leading-normal dark:text-white">{trips[id].pickup_location}</h6>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40">
                      <div className="text-center">
                        <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60">Drop Off Location:</p>
                        <h6 className="mb-0 text-sm leading-normal dark:text-white">{trips[id].dropoff_location}</h6>
                      </div>
                    </td>
                    <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40">
                      <div className="text-center">
                        <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60">Load Description:</p>
                        <h6 className="mb-0 text-sm leading-normal dark:text-white">{trips[id].load_description}</h6>
                      </div>
                    </td>
                    <td className="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40">
                      <div className="flex-1 text-center">
                        <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60">Cost:</p>
                        <h6 className="mb-0 text-sm leading-normal dark:text-white">R{trips[id].bid}</h6>
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
  );
}
