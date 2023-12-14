import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Divider, Tabs, Tab } from '@nextui-org/react';
import { Toaster, toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import Navigator from '../../Components/Navigator.js';
import { APP_ROUTES, API_ROUTES } from '../../utils/constants.jsx';
import { client } from '../../utils/common.jsx';
import TicketsSort from './Tickets/TicketsSort.js';
import ManageTicketTypes from './TicketTypes/ManageTicketTypes.js';
import ManageClusters from './Clusters/ManageClusters.js';
import ManagePosts from './Posts/ManagePosts.js';
import ManagePosts2 from './Posts/ManagePosts2.js';

function Admin() {
	const token = Cookies.get('token')
	const decodedToken = jwtDecode(token);

	const [tickets] = useState([]);
	const [ticketTypes, setTicketTypes] = useState([]);
	const [clusters, setClusters] = useState([]);
	const [posts, setPosts] = useState([]);
	const [init, setInit] = useState(false);

	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	async function getTicketTypes() {
		await client.get(API_ROUTES.GET_TICKET_TYPES)
				.then((response) => {
					if (response.data) { setTicketTypes(response.data); }
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	async function getClusters() {
		await client.get(API_ROUTES.GET_CLUSTERS)
				.then((response) => {
					if (response.data) { setClusters(response.data); }
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	async function getPosts() {
		await client.get(API_ROUTES.GET_POSTS)
				.then((response) => {
					if (response.data) { setPosts(response.data); }
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
		if (!init && decodedToken.user.IsStaff) { setInit(true); getTicketTypes(); getClusters(); getPosts(); }
	}, [init, decodedToken.user.IsStaff])

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

				<Tab key="posts" title="Posts">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<ManagePosts posts={posts} setPosts={setPosts} clusters={clusters} />
					</div>
				</Tab>

				<Tab key="posts2" title="Posts2">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<ManagePosts2 posts={posts} setPosts={setPosts} clusters={clusters} />
					</div>
				</Tab>
			</Tabs>
		</>
	);
}

export default Admin;
