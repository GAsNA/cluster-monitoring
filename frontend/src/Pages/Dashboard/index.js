import React, { useState, useCallback, useEffect } from 'react';
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

	const changeCluster = useCallback((newClusterId) => {
		if (cluster && parseInt(newClusterId) === cluster.ID) { return }

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
	}, [allClusters, cluster, setAllClusters, setCluster])
	
	const addListeners = useCallback(() => {
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
	}, [setSelectedSeat, setOpenModal, setSeatHover])

	useEffect(() => {
		if (selectedSeat) {
			getTickets("desc", "10", "1", selectedSeat.id, "", "", "")
				.then(function(d) {
					if (d.err === null) {
						setTicketsBySeat(d.data);
					}
				})
		}
		if (!getTtAndClusters) {
			setGetTtAndClusters(true);

			/*let hasMore = true, err = null, page = 1;
			while (hasMore) {
				getTicketTypes("asc", "30", page)
					// eslint-disable-next-line
					.then(function(d) {
						err = d.err;
						if (d.err !== null) { return }
						if (d.data.length > 0) { hasMore = false; return }
						const newTTs = issueTypes;
						newTTs.push(...d.data);
						setIssueTypes(newTTs);
					})
				if (err !== null) { break }
				page += 1;
			}

			hasMore = true; err = null; page = 1;
			while (hasMore) {
				getClusters("asc", "30", page)
					// eslint-disable-next-line
					.then(function(d) {
						err = d.err;
						if (d.err !== null) { return }
						if (d.data.length > 0) { hasMore = false; return }
						const newCs = allClusters;
						newCs.push(...d.data);
						setAllClusters(newCs);
					})
				if (err !== null) { break }
				page += 1;
			}*/

			getTicketTypes("asc", "30", "1")
				.then(function(d) {
					if (d.err !== null) { return }
					setIssueTypes(d.data);
				})

			getClusters("asc", "30", "1")
				.then(function(d) {
					if (d.err !== null) { return }
					setAllClusters(d.data);
				})

			setInitAllClusters(true);
		}
	}, [selectedSeat, getTtAndClusters, allClusters, issueTypes]);

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
