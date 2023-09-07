import React from 'react';
import { Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import '../../CSS/Login.css';

export const client = axios.create({
	baseURL: "http://localhost:3000/",
	timeout: 1000,
});

function Login() {
	const navigate = useNavigate();
	
	if (Cookies.get('connected')) {
		return <Navigate to="/dashboard" replace />;
	}

	async function login_out() {
		await client.post("auth/login", "")
				.then((response) => {
					Cookies.set('connected', 'connected')
					navigate("/dashboard")
				})
				.catch((error) => {
					throw error
				});
	}

	return (
		<div className="center">
			<Button onPress={login_out} color="primary" size="lg" radius="md" variant="ghost" className="-translate-x-1/2 -translate-y-1/2">
				Login
			</Button>
		</div>
	);
}

export default Login;
