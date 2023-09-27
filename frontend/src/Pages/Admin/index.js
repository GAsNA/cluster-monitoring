import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Divider, Tabs, Tab } from '@nextui-org/react';
import { Toaster, toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import Navigator from '../../Components/Navigator.js';
import { APP_ROUTES, API_ROUTES } from '../../utils/constants.jsx';
import { client } from '../../utils/common.jsx';
import TicketsSort from './TicketsSort.js';
import ManageTicketTypes from './ManageTicketTypes.js';
import ManageClusters from './ManageClusters.js';

function Admin() {
	const user = JSON.parse(localStorage.getItem("user"))

	const [tickets, setTickets] = useState([]);
	const [issueTypes, setIssueTypes] = useState([]);
	const [clusters, setClusters] = useState([]);
	const [init, setInit] = useState(false);

	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	async function getAllTickets() {
		await client.get(API_ROUTES.GET_TICKETS)
				.then((response) => {
					setTickets(response.data);
					console.log(response.data)
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	async function getIssueTypes() {
		await client.get(API_ROUTES.GET_TICKET_TYPES)
				.then((response) => {
					console.log(response.data)
					var data = response.data
					setIssueTypes(data)
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	async function getClusters() {
		await client.get(API_ROUTES.GET_CLUSTERS)
				.then((response) => {
					console.log(response.data);
					setClusters(response.data);
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
		if (!init) { setInit(true); getAllTickets(); getIssueTypes(); getClusters(); }
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
						<TicketsSort tickets={tickets} issueTypes={issueTypes} />
					</div>
				</Tab>

				<Tab key="cluster-ticketTypes" title="Cluster/Ticket Types">
					<div style={{ maxWidth: '1000px', margin: 'auto' }}>
						<div style={{ height: (windowHeight*40/100) + 'px', overflow: 'auto', marginBottom: '2%' }}>
							<ManageTicketTypes tickets={tickets} issueTypes={issueTypes} />
						</div>

						<Divider orientation="horizontal" />

						<div style={{ height: (windowHeight*40/100) + 'px', overflow: 'auto', marginTop: '2%' }}>
							<ManageClusters tickets={tickets} clusters={clusters} />
						</div>
					</div>
				</Tab>
			</Tabs>
		</>
	);
}

export default Admin;
