import React , { useState } from 'react'
import { ADMIN_DASHBOARD_BOTTOM_LINKS, ADMIN_DASHBOARD_LINKS } from '../../../lib/utils/navigation';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../../logo.jpg";
import classNames from 'classnames'

const linkStyles = 'flex items-center gap-2 font-light py-2 hover:bg-gray-700 hover:no-underline active:bg-gray-600 rounded-sm text-base'

export default function SidebarAdmin() {
	return (
		<div className="bg-[#414043] p-3 w-60 text-white flex flex-col">
			<div className="flex items-center gap-2 px-1 py-2">
				<img src={logo} className='object-fit mx-auto w-2/4' alt='logo' />
			</div>
			<div className="flex-1 py-8 flex flex-col gap-0.5">
				{ADMIN_DASHBOARD_LINKS.map((item) => (
					<SideBarAdminLink key={item.key} item={item}/>
					))}
			</div>
			<div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700 cursor-pointer">
			{ADMIN_DASHBOARD_BOTTOM_LINKS.map((item) => (
				<SideBarAdminLink key={item.key} item={item} />
				))}
			</div>
		</div>
	);
}

const SideBarAdminLink = ({ item }) => {
	const { pathname } = useLocation();
	
	console.log(pathname)
	return (
		<Link to={item.path} className={classNames(pathname === item.path ? 'bg-green-100': 'text-gray-100', linkStyles)}
		>
			<span className="text-xl">{item.icon}</span>
			{item.label}
		</Link>
	)
}


