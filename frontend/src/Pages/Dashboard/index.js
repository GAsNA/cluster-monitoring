import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { Navbar, NavbarContent, NavbarItem, Image, Button } from '@nextui-org/react';
import { APP_ROUTES } from '../../utils/constants.jsx';
import '../../CSS/Dashboard.css';
import Navigator from '../../Components/Navigator.js';

function Dashboard() {
	const items = [
		{ id: 0, name: 'Bess-f1', isActive: true, link: 'https://cdn.intra.42.fr/cluster/image/182/BESS-f1.svg' },
		{ id: 1, name: 'Bess-f2', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/183/BESS-f2.svg' },
		{ id: 2, name: 'Bess-f3', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/184/BESS-f3.svg' },
		{ id: 3, name: 'Bess-f4', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/185/BESS-f4.svg' },
		{ id: 4, name: 'Paul-f3', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/201/PAUL-f3.svg' },
		{ id: 5, name: 'Paul-f4', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/202/PAUL-f4.svg' },
		{ id: 6, name: 'Paul-f5', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/203/PAUL-f5.svg' },
		{ id: 7, name: 'Made-f0A', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/219/MADE-f0A.svg' },
		{ id: 8, name: 'Made-f0B', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/220/MADE-f0B.svg' },
		{ id: 9, name: 'Made-f0C', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/221/MADE-f0C.svg' },
		{ id: 10, name: 'Made-f0D', isActive: false, link: 'https://cdn.intra.42.fr/cluster/image/222/MADE-f0D.svg' },
	];
	
	const [allClusters, setAllClusters] = useState(items);
	
	const [cluster, setCluster] = useState(items[0]);

	if (!Cookies.get('connected')) {
		return <Navigate to={APP_ROUTES.HOME} replace />;
	}

	const changeCluster = (newClusterId) => {
		changeClusterIsActive(cluster.id);
		changeClusterIsActive(parseInt(newClusterId));
		setAllClusters(
			allClusters.map((item) => (
				item.id === cluster.id
					? { ...item, isActive: false }
					: ( item.id === parseInt(newClusterId)
						? { ...item, isActive: true }
						: { ...item }
					)
			))
		);
		setCluster(allClusters[newClusterId]);
	}

	return (
		<div>
			<Navigator />

			<Navbar maxWidth="full" isBordered>
				<NavbarContent className="sm:flex gap-4">
					{allClusters.map((item) => (
						<NavbarItem isActive={item.isActive} key={item.name}>
							<Button value={item.id} onPress={e => changeCluster(e.target.value)} color={item.isActive && "primary"}>{item.name}</Button>
						</NavbarItem>
					))}
				</NavbarContent>
			</Navbar>

			<Image width={1200} alt={`svg-${cluster.name}`} src={cluster.link} />
		</div>
	);
}

export default Dashboard;
