import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Avatar, Link, Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../utils/constants.jsx';
import { client } from '../utils/common.jsx';

function Navigator() {
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"))

	async function logout() {
		await client.post(API_ROUTES.LOGOUT, "")
				.then((response) => {
					Cookies.remove("token")
					localStorage.clear();
					navigate(APP_ROUTES.HOME)
				})
				.catch((error) => {
					throw error
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
						<Button variant="light">
							<Link color="foreground" href={ APP_ROUTES.DASHBOARD }>Dashboard</Link>
						</Button>
					</NavbarItem>
					<NavbarItem>
						<Button variant="light">
							<Link color="foreground" href={ APP_ROUTES.ADMIN }>Admin</Link>
						</Button>
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
						<DropdownItem textValue="logout" key="logout" color="danger" onAction={logout}>Log Out</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
		</Navbar>
	);
}

export default Navigator;
