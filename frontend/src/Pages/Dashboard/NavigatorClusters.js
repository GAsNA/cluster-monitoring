import React from 'react';
import { Navbar, NavbarContent, NavbarItem, Button } from '@nextui-org/react';

function NavigatorClusters({ allClusters, changeCluster }) {
	return (
			<Navbar maxWidth="full" isBordered height="100%">
				<NavbarContent className="sm:flex gap-4" style={{ display: 'flex', flexWrap: 'wrap', paddingBottom: '10px' }}>
					{allClusters.map((item) => (
						<NavbarItem isActive={item.IsActive} key={item.Name}>
							<Button value={item.ID} onPress={e => changeCluster(e.target.value)}
								color={item.IsActive && "primary"}
							>
								{item.Name}
							</Button>
						</NavbarItem>
					))}
				</NavbarContent>
			</Navbar>
	);
}

export default NavigatorClusters;
