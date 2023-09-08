import React from 'react';
import { Image, Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../../utils/constants.jsx';
import { client } from '../../utils/common.jsx';
import '../../CSS/Login.css';
import FtLogo from '../../Images/42_logo.svg';

function Login() {
	const navigate = useNavigate();
	
	if (Cookies.get('connected')) {
		return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
	}

	async function login_out() {
		await client.post(API_ROUTES.LOGIN, "")
				.then((response) => {
					Cookies.set('connected', 'connected')
					navigate(APP_ROUTES.DASHBOARD)
				})
				.catch((error) => {
					throw error
				});
	}

	return (
		<div className="center">
			<Image width={300} alt="42 Logo" src={FtLogo} className="-translate-x-1/2 -translate-y-1/2" />
			<Button onPress={login_out} color="primary" size="lg" radius="md" variant="ghost" className="-translate-x-1/2 -translate-y-1/2">
				Login
			</Button>
		</div>
	);
}

export default Login;
