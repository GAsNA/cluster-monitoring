import React from 'react';
import { Navigate } from 'react-router-dom';
import Navigator from '../../Components/Navigator.js';
import { APP_ROUTES } from '../../utils/constants.jsx';

function Admin() {
	const user = JSON.parse(localStorage.getItem("user"))
	
	if (user && !user.IsStaff) {
		return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
	}

	return (
		<>
			<Navigator />
			ADMIN PAGE
		</>
	);
}

export default Admin;
