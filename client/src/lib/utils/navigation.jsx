import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { MdOutlineWorkHistory } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { FaRegCalendarAlt } from "react-icons/fa";

export const DASHBOARD_SIDEBAR_LINKS = [
		{
			key: 'dashboard',
			label: 'Dashboard',
			path: '',
			icon: <RxDashboard />
		},

		{
			key: 'Trip History',
			label: 'History',
			path: 'trip-history',
			icon: <MdOutlineWorkHistory />
		},
		{
			key: 'Profile',
			label: 'Profile',
			path: 'profile',
			icon: <CgProfile />
		},
]

export const DASHBOARD_BOTTOM_LINKS = [
		{
			key: 'logout',
			label: 'logout',
			path: 'logout',
			icon: <LuLogOut />
		}

	]


	
export const DASHBOARD_DRIVER_LINKS = [
		{
			key: 'dashboard',
			label: 'Dashboard',
			path: '',
			icon: <RxDashboard />
		},
		{
			key: 'Trip History',
			label: 'History',
			path: 'trip-history',
			icon: <MdOutlineWorkHistory />
		},
		{
			key: 'Calendar',
			label: 'Calendar',
			path: 'calendar',
			icon: <FaRegCalendarAlt />
		},
		{
			key: 'Profile',
			label: 'Profile',
			path: 'profile',
			icon: <CgProfile />
		},
]

export const DASHBOARD_DRIVER_BOTTOM_LINKS = [
		{
			key: 'logout',
			label: 'logout',
			path: 'logout',
			icon: <LuLogOut />
		}

	]

export const ADMIN_DASHBOARD_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '',
		icon: <RxDashboard />
	},

	{
		key: 'Drivers',
		label: 'Drivers',
		path: 'drivers',
		icon: <MdOutlineWorkHistory />
	},
	{
		key: 'Users',
		label: 'Users',
		path: 'users',
		icon: <MdOutlineWorkHistory />
	},
	{
		key: 'Payments',
		label: 'Payments',
		path: 'payments',
		icon: <MdOutlineWorkHistory />
	},
	{
		key: 'Profile',
		label: 'Profile',
		path: 'profile',
		icon: <CgProfile />
	},

]

export const ADMIN_DASHBOARD_BOTTOM_LINKS = [
		{
			key: 'logout',
			label: 'logout',
			path: 'logout',
			icon: <LuLogOut />
		}
]
