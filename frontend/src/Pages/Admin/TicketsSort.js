import React, { useState, useEffect } from 'react';
import { Input, Pagination, Select, SelectItem } from '@nextui-org/react';
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
	const [authorChoice, setAuthorChoice] = useState("");
	const [statusChoice, setStatusChoice] = useState('all');
	
	const statusTypes = [
		{ name: "All", key: 'all' }, 
		{ name: "Success", key: 'success' },
		{ name: "In progress", key: 'inProgress' }
	];

	const [getTickets, setGetTickets] = useState(false);
	const [toRefreshFilteredTickets, setToRefreshFilteredTickets] = useState(false);

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
		setSeatChoice(value);
		setToRefreshFilteredTickets(true);
	}

	function onAuthorChoiceChange(value) {
		setAuthorChoice(value);
		setToRefreshFilteredTickets(true);
	}

	function onStatusChoiceChange(value) {
		setStatusChoice([...value][0]);
		setToRefreshFilteredTickets(true);
	}

	useEffect(() => {
		if (!getTickets) { setGetTickets(true); getAllTickets(); }

		if (toRefreshFilteredTickets) {
			setTicketsFiltered(tickets.filter(ticket => 
				ticket.Seat.includes(seatChoice)
				&& ticket.AuthorLogin.includes(authorChoice)
				&& (statusChoice === 'success' ? ticket.Resolved : (statusChoice === 'inProgress' ? !ticket.Resolved : ticket))
			));
			/*if (statusChoice === 'success') {
				setTicketsFiltered(ticketsFiltered.filter(ticket => ticket.Resolved === true))
			} else if (statusChoice === 'inProgress') {
				setTicketsFiltered(ticketsFiltered.filter(ticket => ticket.Resolved === false))
			}*/
			setToRefreshFilteredTickets(false);
		}

		if (ticketsFiltered) {
			setTicketsToShow(ticketsFiltered.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage));
		} else {
			setTicketsToShow([]);
		}
	}, [getTickets, currentPage, ticketsFiltered, tickets, authorChoice, seatChoice, statusChoice, toRefreshFilteredTickets]);

	return (
		<>
			<div style={{ margin: '20px 0' }}>
				<div style={{ display: 'flex', flexWrap: 'wrap',  }}>

					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Input key="seat" label="Seat" labelPlacement="outside"
							isClearable onValueChange={onSeatChoiceChange}/>
					</div>

					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Input key="author" label="Author" labelPlacement="outside"
							isClearable onValueChange={onAuthorChoiceChange}/>
					</div>

					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Select disallowEmptySelection defaultSelectedKeys={[statusTypes[0].key]}
							label="Status" labelPlacement="outside" onSelectionChange={onStatusChoiceChange}>
							{ statusTypes.map((type) => (
								<SelectItem textValue={type.name} key={type.key}>{type.name}</SelectItem>
							))}
						</Select>
					</div>
				</div>

				{ ticketsFiltered && ticketsFiltered.length > limitPerPage &&
					<Pagination total={Math.ceil(ticketsFiltered.length / limitPerPage)} onChange={setCurrentPage} />
				}
			</div>
			
			{ 
				// container size check
			}
			<div style={{ height: '80%', overflow: 'auto' }}>
				<ListTickets tickets={ticketsToShow} displaySeat />
			</div>
		</>
	);
}

export default TicketsSort;
