import React, { useState, useEffect } from 'react';
import { Input, Pagination } from '@nextui-org/react';
import toast from 'react-hot-toast';
import ListTickets from '../../Components/ListTickets.js';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';

function TicketsSort() {
	const [tickets, setTickets] = useState([]);
	const [ticketsFiltered, setTicketsFiltered] = useState([]);
	const [ticketsToShow, setTicketsToShow] = useState(ticketsFiltered);

	const limitPerPage = 30;
	const [currentPage, setCurrentPage] = useState(1);

	const [seatChoice, setSeatChoice] = useState("");

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
	
	function onSeatChoiceChange(value) {
		setSeatChoice(value)
		if (value !== "") {
			setTicketsFiltered(tickets.filter(ticket => ticket.Seat.includes(value)))
		} else {
			setTicketsFiltered(tickets)
		}
	}

	useEffect(() => {
		if (!getTickets) { setGetTickets(true); getAllTickets(); }

		if (ticketsFiltered) {
			setTicketsToShow(ticketsFiltered.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage));
		} else {
			setTicketsToShow([]);
		}
	}, [getTickets, currentPage, ticketsFiltered, seatChoice, tickets]);

	return (
		<>
			<div style={{ margin: '20px 0' }}>
				<Input key="seat" label="Seat" labelPlacement="outside" isClearable onValueChange={onSeatChoiceChange}/>

				{ ticketsFiltered && ticketsFiltered.length > limitPerPage &&
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
