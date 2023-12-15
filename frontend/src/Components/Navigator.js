import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Avatar, Link, Button } from '@nextui-org/react';
import { logout, anonymisation } from '../utils/functionsAction.js';
import { APP_ROUTES } from '../utils/constants.jsx';
import ModalConfirmation from './ModalConfirmation.js';

function Navigator() {
	const user = JSON.parse(localStorage.getItem("user"))

	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	return (
	<>
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
						<DropdownItem textValue="anonymisation" key="anonymisation" color="danger"
							onAction={() => setOpenModalConfirmation(true)}
						>
							Anonymisation
						</DropdownItem>
						<DropdownItem textValue="logout" key="logout" color="danger" onAction={logout}>
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
		</Navbar>

		<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation} action={anonymisation}
			text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to be anonymise?</p>
		/>
	</>
	);
}

export default Navigator;
