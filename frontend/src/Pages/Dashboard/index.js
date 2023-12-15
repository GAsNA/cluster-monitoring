import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import { getClusters, getTicketTypes, getTickets } from '../../utils/functionsAction.js';
import { APP_ROUTES } from '../../utils/constants.jsx';
import Navigator from '../../Components/Navigator.js';
import NavigatorClusters from './NavigatorClusters.js';
import ModalTickets from './ModalTickets.js';

function Dashboard() {
	const [allClusters, setAllClusters] = useState([]);
	
	const [cluster, setCluster] = useState();
	
	const [seatHover, setSeatHover] = useState("");
	const [selectedSeat, setSelectedSeat] = useState();
	const [issueTypes, setIssueTypes] = useState([]);
	const [ticketsBySeat, setTicketsBySeat] = useState([]);
	
	const [openModal, setOpenModal] = useState(false);

	const [getTtAndClusters, setGetTtAndClusters] = useState(false);
	const [initAllClusters, setInitAllClusters] = useState(false);

	function changeCluster(newClusterId) {
		if (parseInt(newClusterId) === cluster.ID) { return }

		setAllClusters(
			allClusters.map(function (item) {
				if (item.ID === cluster.ID) {
					return {...item, IsActive: false}
				} else if (item.ID === parseInt(newClusterId)) {
					return {...item, IsActive: true}
				}
				return {...item}
			})
		);
		setCluster(allClusters.find((item) => item.ID === parseInt(newClusterId)));
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

	useEffect(() => {
		if (selectedSeat) { getTickets(selectedSeat.id, "desc", "10", setTicketsBySeat); }
		if (!getTtAndClusters) {
			setGetTtAndClusters(true);
			getTicketTypes(setIssueTypes);
			getClusters(setAllClusters);
			setInitAllClusters(true);
		}
	}, [selectedSeat, getTtAndClusters]);

	useEffect(() => {
		if (initAllClusters && allClusters.length > 0) {
			setInitAllClusters(false);
			const clusters = allClusters.map((c) => {
				let temp = {...c}
				temp.IsActive = false
				return temp
			})
			clusters[0].IsActive = true
			setAllClusters(clusters)
			setCluster(clusters[0])
		}
	}, [initAllClusters, allClusters])

	if (!Cookies.get('token')) {
		return <Navigate to={APP_ROUTES.HOME} replace />;
	}

	return (
		<>
			<Navigator />

			<NavigatorClusters allClusters={allClusters} changeCluster={changeCluster} />

			<Toaster toastOptions={{ style: { background: '#231f20', color: 'white' } }} />

			{ cluster &&
				<SvgLoader path={cluster.Link} onSVGReady={addListeners}>
					<SvgProxy selector={"rect"} fill="#e5e5e5" />
					{ seatHover &&
						<SvgProxy key={seatHover} selector={"#" + seatHover + ",#" + seatHover + " path"} fill="#01babc" />
					}
				</SvgLoader>
			}

			{ selectedSeat &&
				<ModalTickets open={openModal} setOpen={setOpenModal} seat={selectedSeat} cluster={cluster} setSelectedSeat={setSelectedSeat} issueTypes={issueTypes} tickets={ticketsBySeat} setTickets={setTicketsBySeat} />
			}
		</>
	);
}

export default Dashboard;
