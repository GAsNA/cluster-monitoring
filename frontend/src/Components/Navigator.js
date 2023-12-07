import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Avatar, Link, Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { API_ROUTES, APP_ROUTES } from '../utils/constants.jsx';
import { client } from '../utils/common.jsx';

function Navigator() {
	const user = JSON.parse(localStorage.getItem("user"))

	async function logout() {
		await client.post(API_ROUTES.LOGOUT, "")
				.then((response) => {
					Cookies.remove("token")
					localStorage.clear();
					window.location.replace(APP_ROUTES.HOME);
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	return (
		<Navbar maxWidth="full" shouldHideOnScroll>
			<NavbarBrand>
				<Link color="foreground" href={ APP_ROUTES.DASHBOARD }>
					<p className="font-bold text-inherit">CLUSTER MONITORING</p>
				</Link>
			</NavbarBrand>

			{ user && user.IsStaff &&
				<NavbarContent className="gap-4" justify="center">
					<NavbarItem>
						<Link color="foreground" href={ APP_ROUTES.DASHBOARD }>
							<Button variant="light">Dashboard</Button>
						</Link>
					</NavbarItem>
					<NavbarItem>
						<Link color="foreground" href={ APP_ROUTES.ADMIN }>
							<Button variant="light">Admin</Button>
						</Link>
					</NavbarItem>
				</NavbarContent>
			}
			
			<NavbarContent as="div" justify="end">
				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Avatar isBordered as="button" className="transition-transform" color="secondary"
							name={ user && user.Login } size="sm" src={ user && user.Image } />
					</DropdownTrigger>

					<DropdownMenu aria-label="Profile Actions" variant="flat">
						<DropdownItem textValue="profile" key="profile" className="h-14 gap-2">
							<p className="font-semibold">Signed in as</p>
							<p className="font-semibold" style={{ color: '#01babc' }}>
								{ user && user.Login }
							</p>
						</DropdownItem>
						<DropdownItem textValue="anonymisation" key="anonymisation" color="danger">Anonymisation</DropdownItem>
						<DropdownItem textValue="logout" key="logout" color="danger" onAction={logout}>Log Out</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
		</Navbar>
	);
}

export default Navigator;
