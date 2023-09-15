import React from 'react';
import { Image, Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { Navigate, useSearchParams } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES, URL_INTRA_AUTHORIZE } from '../../utils/constants.jsx';
import '../../CSS/Login.css';
import FtLogo from '../../Images/42_logo.svg';
import ErrorCard from '../../Components/ErrorCard.js';

function Login() {
	const [queryParameters] = useSearchParams();
	const error = queryParameters.get("error");
	const error_description = queryParameters.get("error_description");
	
	if (Cookies.get('connected')) {
		return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
	}

	async function login() {
		window.location.replace(URL_INTRA_AUTHORIZE + "?client_id=" + process.env.REACT_APP_UID + "&redirect_uri=" + API_ROUTES.ROOT + "/" + API_ROUTES.LOGIN + "&response_type=code&scope=public")
	}

	return (
		<div className="center">
			<Image width={300} alt="42 Logo" src={FtLogo} className="-translate-x-1/2 -translate-y-1/2" style={{ marginTop: '20px' }} />
			
			<Button onPress={login} color="primary" size="lg" radius="md" variant="ghost" className="-translate-x-1/2 -translate-y-1/2">
				Login
			</Button>
			
			{ error &&
				<div style={{ transform: 'translate(-50%, 0)', maxWidth: '500px' }}>
					<ErrorCard title="Error:" description={error_description} />
				</div>
			}
		</div>
	);
}

export default Login;
