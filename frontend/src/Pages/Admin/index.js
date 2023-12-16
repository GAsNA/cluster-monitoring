import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Divider, Tabs, Tab } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import Navigator from '../../Components/Navigator.js';
import { getClusters, getTicketTypes } from '../../utils/functionsAction.js';
import { APP_ROUTES } from '../../utils/constants.jsx';
import TicketsSort from './Tickets/TicketsSort.js';
import ManageTicketTypes from './TicketTypes/ManageTicketTypes.js';
import ManageClusters from './Clusters/ManageClusters.js';
//import ManagePosts from './Posts/ManagePosts.js';
import ManagePosts2 from './Posts/ManagePosts2.js';

function Admin() {
	const token = Cookies.get('token')
	const decodedToken = jwtDecode(token);

	const [tickets] = useState([]);
	const [ticketTypes, setTicketTypes] = useState([]);
	const [clusters, setClusters] = useState([]);
	const [init, setInit] = useState(false);

	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	useLayoutEffect(() => {
		function updateWindowHeight() {
			setWindowHeight(window.innerHeight);
		}

		window.addEventListener('resize', updateWindowHeight);
		updateWindowHeight();
		return () => window.removeEventListener('resize', updateWindowHeight);
	}, []);

	useEffect(() => {
		if (!init && decodedToken.user.IsStaff) {
			setInit(true);
			
			/*let hasMore = true, err = null, page = 1;
			while (hasMore) {
				getTicketTypes("asc", "30", page)
					// eslint-disable-next-line
					.then(function(d) {
						err = d.err;
						if (d.err !== null) { return }
						if (d.data.length > 0) { hasMore = false; return }
						const newTTs = ticketTypes;
						newTTs.push(...d.data);
						setTicketTypes(newTTs);
						page += 1;
					})
				if (err !== null) { break }
			}
			
			hasMore = true; err = null; page = 1;
			while (hasMore) {
				getClusters("asc", "30", page)
					// eslint-disable-next-line
					.then(function(d) {
						err = d.err;
						if (d.err !== null) { return }
						if (d.data.length > 0) { hasMore = false; return }
						const newCs = clusters;
						newCs.push(...d.data);
						setClusters(newCs);
						page += 1;
					})
				if (err !== null) { break }
			}*/

			getTicketTypes("asc", "30", "1")
				.then(function(d) {
					if (d.err !== null) { return }
					setTicketTypes(d.data);
				})

			getClusters("asc", "30", "1")
				.then(function(d) {
					if (d.err !== null) { return }
					setClusters(d.data);
				})
		}
	}, [init, decodedToken.user.IsStaff, clusters, ticketTypes])

	// Check rights to this page
	if (!token) return <Navigate to="/" />;	
	if (!decodedToken.user.IsStaff) {
		return <Navigate to={APP_ROUTES.DASHBOARD} />;
	}

	return (
		<>
			<Navigator />

			<Toaster toastOptions={{ style: { background: '#231f20', color: 'white' } }} />
			
			<Tabs aria-label="Options">
				<Tab key="tickets" title="Tickets">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<TicketsSort ticketTypes={ticketTypes} />
					</div>
				</Tab>

				<Tab key="cluster-ticketTypes" title="Cluster/Ticket Types">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<div style={{ height: (windowHeight*40/100) + 'px', overflow: 'auto', marginBottom: '2%' }}>
							<ManageTicketTypes tickets={tickets} ticketTypes={ticketTypes} setTicketTypes={setTicketTypes} />
						</div>

						<Divider orientation="horizontal" />

						<div style={{ height: (windowHeight*40/100) + 'px', overflow: 'auto', marginTop: '2%' }}>
							<ManageClusters tickets={tickets} clusters={clusters} setClusters={setClusters} />
						</div>
					</div>
				</Tab>

				{/*<Tab key="posts" title="Posts">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<ManagePosts posts={posts} setPosts={setPosts} clusters={clusters} />
					</div>
				</Tab>*/}

				<Tab key="posts2" title="Posts2">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<ManagePosts2 clusters={clusters} />
					</div>
				</Tab>
			</Tabs>
		</>
	);
}

export default Admin;
