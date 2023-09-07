import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../../CSS/Login.css';

export const client = axios.create({
	baseURL: "http://localhost:3000/",
	timeout: 1000,
});

function Login() {

	const [title, setTitle] = useState(Cookies.get("connected") ? "Logout" : "Login");

	async function login_out() {
		if (!Cookies.get('connected')) {
			await client.post("auth/login", "")
					.then((response) => {
						Cookies.set('connected', 'connected')
						setTitle("Logout")
					})
					.catch((error) => {
						throw error
					});
		} else {
			await client.post("auth/logout", "")
					.then((response) => {
						Cookies.remove('connected')
						setTitle("Login")
					})
					.catch((error) => {
						throw error
					});
		}
	}

	return (
		<div className="center">
			<Button onPress={login_out} color="primary" size="lg" radius="md" variant="ghost" className="-translate-x-1/2 -translate-y-1/2">
				{title}
			</Button>
		</div>
	);
}

export default Login;
