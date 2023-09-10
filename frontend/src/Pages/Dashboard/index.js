import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { Navbar, NavbarContent, NavbarItem, Button } from '@nextui-org/react';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import { APP_ROUTES } from '../../utils/constants.jsx';
import Navigator from '../../Components/Navigator.js';
import ModalTickets from '../../Components/ModalTickets.js';

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
	
	const [seatHover, setSeatHover] = useState("");
	const [selectedSeat, setSelectedSeat] = useState();
	
	const [openModal, setOpenModal] = useState(false);

	const changeCluster = (newClusterId) => {
		if (parseInt(newClusterId) === cluster.id) { return }

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

	function addListeners() {
		document.querySelectorAll('image').forEach(item => {
			item.addEventListener('click', event => {
				setSelectedSeat(item);
				setOpenModal(true);
			})
			item.addEventListener('mouseenter', event => {
				setSeatHover(item.id);
			})
			item.addEventListener('mouseleave', event => {
				setSeatHover("");
			})
		})
	}

	if (!Cookies.get('connected')) {
		return <Navigate to={APP_ROUTES.HOME} replace />;
	}

	return (
		<>
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

			<SvgLoader path={cluster.link} onSVGReady={addListeners}>
				<SvgProxy selector={"rect"} fill="#e5e5e5" />
				{ seatHover &&
					<SvgProxy key={seatHover} selector={"#" + seatHover + ",#" + seatHover + " path"} fill="#01babc" />
				}
			</SvgLoader>

			{ selectedSeat &&
				<ModalTickets open={openModal} setOpen={setOpenModal} seat={selectedSeat} />
			}
		</>
	);
}

export default Dashboard;
