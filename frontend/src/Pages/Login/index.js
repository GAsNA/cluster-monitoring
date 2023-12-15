import React, { useState } from 'react';
import { Image, Button, Checkbox } from '@nextui-org/react';
import Cookies from 'js-cookie';
import { Navigate, useSearchParams } from 'react-router-dom';
import { login, localStoreMe } from '../../utils/functionsAction.js';
import { APP_ROUTES } from '../../utils/constants.jsx';
import '../../CSS/Login.css';
import FtLogo from '../../Images/42_logo.svg';
import ErrorCard from '../../Components/ErrorCard.js';

function Login() {
	const [queryParameters] = useSearchParams();
	const error = queryParameters.get("error");
	const error_description = queryParameters.get("error_description");

	const [staff, setStaff] = useState(false);

	if (Cookies.get('token')) {
		localStoreMe();
		return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
	}

	return (
		<div className="center">
			<Image width={300} alt="42 Logo" src={FtLogo} className="-translate-x-1/2 -translate-y-1/2" style={{ marginTop: '20px' }} />
			
			<Button onPress={() => login(staff)} color="primary" size="lg" radius="md" variant="ghost" className="-translate-x-1/2 -translate-y-1/2">
				Login
			</Button>
			
			{ error &&
				<div style={{ transform: 'translate(-50%, 0)', maxWidth: '500px' }}>
					<ErrorCard title="Error:" description={error_description} />
				</div>
			}

			{ /*PROVISIONAL: to delete when not needed anymore*/ }
			<Checkbox isSelected={staff} onValueChange={setStaff}>Staff</Checkbox>
		</div>
	);
}

export default Login;
