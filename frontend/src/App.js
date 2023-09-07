import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './CSS/App.css';

function App() {
	return (
		<Router>
			<div className='App main'>
				<Routes>
					<Route
						path='/'
						element={ <Login/> }
					/>
				</Routes>
			</div>
		</Router>
	)
}

export default App;
