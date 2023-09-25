import React, { useState, useEffect } from 'react';
import { Input, Pagination, Select, SelectItem, RadioGroup, Radio } from '@nextui-org/react';
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
	const [issueTypeChoice, setIssueTypeChoice] = useState(-1);
	const [orderByDateChoice, setOrderByDateChoice] = useState('desc');
	
	const statusTypes = [
		{ name: "All", key: 'all' }, 
		{ name: "Resolved", key: 'resolved' },
		{ name: "In progress", key: 'inProgress' }
	];
	const [issueTypes, setIssueTypes] = useState([]);
	const orderByDate = [
		{ name: "Desc", key: 'desc' }, 
		{ name: "Asc", key: 'asc' },
	];

	const [getTicketsAndTypes, setGetTicketsAndTypes] = useState(false);
	const [toRefreshFilteredTickets, setToRefreshFilteredTickets] = useState(false);

	async function getAllTickets() {
		await client.get(API_ROUTES.GET_TICKETS)
				.then((response) => {
					setTickets(response.data);
					setTicketsFiltered(response.data);
					console.log(response)
					setToRefreshFilteredTickets(true);
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	async function getIssueTypes() {
		await client.get(API_ROUTES.GET_TICKET_TYPES)
				.then((response) => {
					console.log(response)
					var data = [{ID: -1, Name: "All"}, ...response.data]
					setIssueTypes(data)
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}
	
	function onSeatChoiceChange(value) {
		setSeatChoice(value.toLowerCase());
		setToRefreshFilteredTickets(true);
	}

	function onAuthorChoiceChange(value) {
		setAuthorChoice(value.toLowerCase());
		setToRefreshFilteredTickets(true);
	}

	function onStatusChoiceChange(value) {
		setStatusChoice([...value][0]);
		setToRefreshFilteredTickets(true);
	}

	function onIssueTypeChoiceChange(value) {
		setIssueTypeChoice([...value][0]);
		setToRefreshFilteredTickets(true);
	}

	function onOrderByDateChoiceChange(value) {
		setOrderByDateChoice(value);
		setToRefreshFilteredTickets(true);
	}

	useEffect(() => {
		if (!getTicketsAndTypes) { setGetTicketsAndTypes(true); getAllTickets(); getIssueTypes(); }

		if (toRefreshFilteredTickets) {
			var newTicketsFiltered = tickets.filter(ticket => 
				ticket.Seat.toLowerCase().includes(seatChoice)
				&& ticket.AuthorLogin.toLowerCase().includes(authorChoice)
				&& (statusChoice === 'resolved' ? ticket.Resolved : (statusChoice === 'inProgress' ? !ticket.Resolved : ticket))
				&& (Number(issueTypeChoice) !== -1 ? (ticket.Type === Number(issueTypeChoice)) : ticket)
			);
			if (orderByDateChoice === 'desc') {
				newTicketsFiltered = newTicketsFiltered ?
										[...newTicketsFiltered].sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1,)
										: [];
			} else if (orderByDateChoice === 'asc') {
				newTicketsFiltered = newTicketsFiltered ?
										[...newTicketsFiltered].sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1,)
										: [];
			}
			setTicketsFiltered(newTicketsFiltered);
			setToRefreshFilteredTickets(false);
		}

		if (ticketsFiltered) {
			setTicketsToShow(ticketsFiltered.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage));
		} else {
			setTicketsToShow([]);
		}
	}, [getTicketsAndTypes, currentPage, ticketsFiltered, tickets, authorChoice, seatChoice, statusChoice, issueTypeChoice, orderByDateChoice, toRefreshFilteredTickets]);

	return (
		<>
			<div style={{ margin: '20px 0' }}>
				<div style={{ display: 'flex', flexWrap: 'wrap' }}>

					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Input key="seat" label="Seat" labelPlacement="outside"
							isClearable onValueChange={onSeatChoiceChange}/>
					</div>

					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Input key="author" label="Author" labelPlacement="outside"
							isClearable onValueChange={onAuthorChoiceChange}/>
					</div>

					<div style={{ width: '200px', margin: '15px 1%' }}>
						<Select disallowEmptySelection defaultSelectedKeys={[statusTypes[0].key]} label="Status"
							labelPlacement="outside" onSelectionChange={onStatusChoiceChange} >
								{ statusTypes.map((type) => (
									<SelectItem textValue={type.name} key={type.key}>{type.name}</SelectItem>
								))}
						</Select>
					</div>

					<div style={{ width: '200px', margin: '15px 1%' }}>
						{ issueTypes && issueTypes.length > 0 &&
						<Select disallowEmptySelection defaultSelectedKeys={[(issueTypes[0].ID).toString()]} label="Issue types"
							labelPlacement="outside" onSelectionChange={onIssueTypeChoiceChange} >
								{ issueTypes.map((type) => (
									<SelectItem textValue={type.Name} key={type.ID}>{type.Name}</SelectItem>
								))}
						</Select>
						}
					</div>
					
					<RadioGroup label="Order by date" orientation="horizontal" value={orderByDateChoice}
						onValueChange={onOrderByDateChoiceChange}
					>
						{ orderByDate.map((order) => (
							<Radio value={order.key}>{order.name}</Radio>
						))}
					</RadioGroup>

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
