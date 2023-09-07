import './App.css';
import { Button } from '@nextui-org/react';
import Cookies from 'js-cookie';
import axios from 'axios';

function App() {

	async function login() {
		await axios.post("http://localhost:3000/auth", "")
				.then((response) => {
					Cookies.set('connected', 'connected')
				})
				.catch((error) => {
					throw error
				});
	}

	return (
		<div className="App">
			<Button OnPress={login}>Login</Button>
		</div>
	);
}

export default App;
