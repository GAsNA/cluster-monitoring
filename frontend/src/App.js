import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Admin from './Pages/Admin';
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
					<Route
						path='/admin'
						element={ <Admin/> }
					/>
				</Routes>
			</div>
		</Router>
	)
}

export default App;
