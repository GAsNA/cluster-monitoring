import React, { useState, useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import toast from 'react-hot-toast';
import ListTickets from '../../Components/ListTickets.js';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';

function TicketsSort() {
	const [tickets, setTickets] = useState([]);
	const [ticketsFiltered, setTicketsFiltered] = useState([]);
	const [ticketsToShow, setTicketsToShow] = useState(ticketsFiltered);

	const limitPerPage = 30;
	const [currentPage, setCurrentPage] = React.useState(1);

	const [getTickets, setGetTickets] = useState(false);

	async function getAllTickets() {
		await client.get(API_ROUTES.GET_TICKETS)
				.then((response) => {
					setTickets(response.data);
					setTicketsFiltered(response.data);
					console.log(response.data)
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	useEffect(() => {
		if (!getTickets) { setGetTickets(true); getAllTickets(); }
		setTicketsToShow(ticketsFiltered.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage));
	}, [getTickets, currentPage, ticketsFiltered]);

	return (
		<>
			<div style={{ marginBottom: '1%' }}>
				{ ticketsFiltered.length > 0 && 
					<Pagination total={Math.ceil(ticketsFiltered.length / limitPerPage)} onChange={setCurrentPage} />
				}
			</div>
			
			<div style={{ height: '95%', overflow: 'auto' }}>
				<ListTickets tickets={ticketsToShow} displaySeat />
			</div>
		</>
	);
}

export default TicketsSort;
