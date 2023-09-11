import React from 'react';
import { Navbar, NavbarContent, NavbarItem, Button } from '@nextui-org/react';

function NavigatorClusters({ allClusters, changeCluster }) {
	return (
			<Navbar maxWidth="full" isBordered>
				<NavbarContent className="sm:flex gap-4">
					{allClusters.map((item) => (
						<NavbarItem isActive={item.isActive} key={item.name}>
							<Button value={item.id} onPress={e => changeCluster(e.target.value)} color={item.isActive && "primary"}>{item.name}</Button>
						</NavbarItem>
					))}
				</NavbarContent>
			</Navbar>
	);
}

export default NavigatorClusters;
