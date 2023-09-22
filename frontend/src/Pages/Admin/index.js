import React, { useState, useLayoutEffect } from 'react';
import { Divider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import Navigator from '../../Components/Navigator.js';
import { APP_ROUTES } from '../../utils/constants.jsx';
import TicketsSort from './TicketsSort.js';

function Admin() {
	const user = JSON.parse(localStorage.getItem("user"))

	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	
	useLayoutEffect(() => {
		function updateWindowHeight() {
			setWindowHeight(window.innerWeight);
		}

		window.addEventListener('resize', updateWindowHeight);
		updateWindowHeight();
		return () => window.removeEventListener('resize', updateWindowHeight);
	}, []);

	if (user && !user.IsStaff) {
		return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
	}

	return (
		<>
			<Navigator />

			<Toaster toastOptions={{ style: { background: '#231f20', color: 'white' } }} />
			
			<div className="flex h-auto items-center space-x-4">
				<div style={{ width: '50%', height: (windowHeight * 92 / 100) + 'px', borderRight: 'grey 1px solid', padding: '.5% 1%' }}>
					<TicketsSort />
				</div>
				
				<Divider orientation="vertical" />
				
				<div style={{ width: '50%', padding: '.5% 1%' }}>
					<div>
						MANAGE TICKET TYPES
					</div>

					<Divider orientation="horizontal" />

					<div>
						MANAGE CLUSTERS
					</div>
				</div>
			</div>
		</>
	);
}

export default Admin;
