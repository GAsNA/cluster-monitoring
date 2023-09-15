import React from 'react';
import { Image, Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES, URL_INTRA_AUTHORIZE } from '../../utils/constants.jsx';
import '../../CSS/Login.css';
import FtLogo from '../../Images/42_logo.svg';

function Login() {
	if (Cookies.get('connected')) {
		return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
	}

	async function login() {
		window.location.replace(URL_INTRA_AUTHORIZE + "?client_id=" + process.env.REACT_APP_UID + "&redirect_uri=" + API_ROUTES.ROOT + "/" + API_ROUTES.LOGIN + "&response_type=code&scope=public")
	}

	return (
		<div className="center">
			<Image width={300} alt="42 Logo" src={FtLogo} className="-translate-x-1/2 -translate-y-1/2" />
			<Button onPress={login} color="primary" size="lg" radius="md" variant="ghost" className="-translate-x-1/2 -translate-y-1/2">
				Login
			</Button>
		</div>
	);
}

export default Login;
