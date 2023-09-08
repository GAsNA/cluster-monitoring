import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
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
					<Route
						path='/dashboard'
						element={ <Dashboard/> }
					/>
				</Routes>
			</div>
		</Router>
	)
}

export default App;
