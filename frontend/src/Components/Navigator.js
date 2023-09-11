import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Avatar } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../utils/constants.jsx';
import { client } from '../utils/common.jsx';

function Navigator() {
	const navigate = useNavigate();

	async function logout() {
		await client.post(API_ROUTES.LOGOUT, "")
				.then((response) => {
					Cookies.remove('connected')
					navigate(APP_ROUTES.HOME)
				})
				.catch((error) => {
					throw error
				})
	}

	return (
		<Navbar maxWidth="full" shouldHideOnScroll>
			<NavbarBrand>
				<p className="font-bold text-inherit">CLUSTER MONITORING</p>
			</NavbarBrand>
			
			<NavbarContent as="div" justify="end">

				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Avatar isBordered as="button" className="transition-transform" color="secondary"
							name="Jason Hughes" size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
					</DropdownTrigger>

					<DropdownMenu aria-label="Profile Actions" variant="flat">
						<DropdownItem textValue="profile" key="profile" className="h-14 gap-2">
							<p className="font-semibold">Signed in as</p>
							<p className="font-semibold">zoey@example.com</p>
						</DropdownItem>
						<DropdownItem textValue="logout" key="logout" color="danger" onAction={logout}>Log Out</DropdownItem>
					</DropdownMenu>
				</Dropdown>

			</NavbarContent>
		</Navbar>
	);
}

export default Navigator;
