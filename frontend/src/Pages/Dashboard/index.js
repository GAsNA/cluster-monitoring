import React from 'react';
import { Image } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '../../utils/constants.jsx';
import '../../CSS/Login.css';
import FtLogo from '../../Images/42_logo.svg';

function Dashboard() {
	if (!Cookies.get('connected')) {
		return <Navigate to={APP_ROUTES.HOME} replace />;
	}

	return (
		<div className="center">
			<Image width={300} alt="42 Logo" src={FtLogo} className="-translate-x-1/2 -translate-y-1/2" />
		</div>
	);
}

export default Dashboard;
