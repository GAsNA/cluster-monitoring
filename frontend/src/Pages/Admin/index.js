import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Divider, Tabs, Tab } from '@nextui-org/react';
import { Toaster, toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import Navigator from '../../Components/Navigator.js';
import { APP_ROUTES, API_ROUTES } from '../../utils/constants.jsx';
import { client } from '../../utils/common.jsx';
import TicketsSort from './TicketsSort.js';
import ManageTicketTypes from './TicketTypes/ManageTicketTypes.js';
import ManageClusters from './Clusters/ManageClusters.js';
import ManagePosts from './Posts/ManagePosts.js';

function Admin() {
	const user = JSON.parse(localStorage.getItem("user"))

	const [tickets, setTickets] = useState([]);
	const [ticketTypes, setTicketTypes] = useState([]);
	const [clusters, setClusters] = useState([]);
	const [posts, setPosts] = useState([]);
	const [init, setInit] = useState(false);

	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	async function getAllTickets() {
		await client.get(API_ROUTES.GET_TICKETS)
				.then((response) => {
					if (response.data) { setTickets(response.data); }
					console.log(response.data)
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	async function getTicketTypes() {
		await client.get(API_ROUTES.GET_TICKET_TYPES)
				.then((response) => {
					if (response.data) { setTicketTypes(response.data); }
					console.log(response.data)
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	async function getClusters() {
		await client.get(API_ROUTES.GET_CLUSTERS)
				.then((response) => {
					if (response.data) { setClusters(response.data); }
					console.log(response.data);
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	async function getPosts() {
		await client.get(API_ROUTES.GET_POSTS)
				.then((response) => {
					if (response.data) { setPosts(response.data); }
					console.log(response.data);
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}
	
	useLayoutEffect(() => {
		function updateWindowHeight() {
			setWindowHeight(window.innerHeight);
		}

		window.addEventListener('resize', updateWindowHeight);
		updateWindowHeight();
		return () => window.removeEventListener('resize', updateWindowHeight);
	}, []);

	useEffect(() => {
		if (!init) { setInit(true); getAllTickets(); getTicketTypes(); getClusters(); getPosts(); }
	}, [init])

	if (user && !user.IsStaff) {
		return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
	}

	return (
		<>
			<Navigator />

			<Toaster toastOptions={{ style: { background: '#231f20', color: 'white' } }} />
			
			<Tabs aria-label="Options">
				<Tab key="tickets" title="Tickets">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<TicketsSort tickets={tickets} setTickets={setTickets} ticketTypes={ticketTypes} />
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

				<Tab key="posts" title="Posts">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<ManagePosts posts={posts} setPosts={setPosts} clusters={clusters} />
					</div>
				</Tab>
			</Tabs>
		</>
	);
}

export default Admin;
