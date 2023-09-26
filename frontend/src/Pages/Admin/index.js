import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Divider } from '@nextui-org/react';
import { Toaster, toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import Navigator from '../../Components/Navigator.js';
import { APP_ROUTES, API_ROUTES } from '../../utils/constants.jsx';
import { client } from '../../utils/common.jsx';
import TicketsSort from './TicketsSort.js';
import ManageTicketTypes from './ManageTicketTypes.js';

function Admin() {
	const user = JSON.parse(localStorage.getItem("user"))

	const [tickets, setTickets] = useState([]);
	const [issueTypes, setIssueTypes] = useState([]);
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
	
	useLayoutEffect(() => {
		function updateWindowHeight() {
			setWindowHeight(window.innerHeight);
		}

		window.addEventListener('resize', updateWindowHeight);
		updateWindowHeight();
		return () => window.removeEventListener('resize', updateWindowHeight);
	}, []);

	useEffect(() => {
		if (!init) { setInit(true); getAllTickets(); getIssueTypes(); }
	}, [init])

	if (user && !user.IsStaff) {
		return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
	}

	return (
		<>
			<Navigator />

			<Toaster toastOptions={{ style: { background: '#231f20', color: 'white' } }} />
			
			<div className="flex h-auto items-center space-x-4">
				<div style={{ width: '50%', height: (windowHeight * 92 / 100) + 'px', borderRight: 'grey 1px solid', padding: '.5% 1%' }}>
					<TicketsSort tickets={tickets} issueTypes={issueTypes} windowHeight={windowHeight} />
				</div>
				
				<Divider orientation="vertical" />
				
				<div style={{ width: '50%', padding: '.5% 1%' }}>
					<div style={{ height: (windowHeight * 43 / 100) + 'px', overflow: 'auto', marginBottom: '2%' }}>
						<ManageTicketTypes tickets={tickets} issueTypes={issueTypes} />
					</div>

					<Divider orientation="horizontal" />

					<div style={{ height: (windowHeight * 43 / 100) + 'px', overflow: 'auto', marginTop: '2%' }}>
						<ManageTicketTypes tickets={tickets} issueTypes={issueTypes} />
					</div>
				</div>
			</div>
		</>
	);
}

export default Admin;
