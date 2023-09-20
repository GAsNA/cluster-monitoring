import React from 'react';
import { Navbar, NavbarContent, NavbarItem, Button } from '@nextui-org/react';

function NavigatorClusters({ allClusters, changeCluster }) {
	return (
			<Navbar maxWidth="full" isBordered>
				<NavbarContent className="sm:flex gap-4">
					{allClusters.map((item) => (
						<NavbarItem isActive={item.IsActive} key={item.Name}>
							<Button value={item.ID} onPress={e => changeCluster(e.target.value)} color={item.IsActive && "primary"}>{item.Name}</Button>
						</NavbarItem>
					))}
				</NavbarContent>
			</Navbar>
	);
}

export default NavigatorClusters;
