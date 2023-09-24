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
	const [issueTypeChoice, setIssueTypeChoice] = useState();
	
	const statusTypes = [
		{ name: "All", key: 'all' }, 
		{ name: "Success", key: 'success' },
		{ name: "In progress", key: 'inProgress' }
	];
	const [issueTypes, setIssueTypes] = useState([]);

	const [getTicketsAndTypes, setGetTicketsAndTypes] = useState(false);
	const [toRefreshFilteredTickets, setToRefreshFilteredTickets] = useState(false);

	async function getAllTickets() {
		await client.get(API_ROUTES.GET_TICKETS)
				.then((response) => {
					setTickets(response.data);
					setTicketsFiltered(response.data);
					console.log(response)
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

	function onIssueTypeChoiceChange(value) {
		setIssueTypeChoice([...value][0]);
		setToRefreshFilteredTickets(true);
	}

	useEffect(() => {
		if (!getTicketsAndTypes) { setGetTicketsAndTypes(true); getAllTickets(); getIssueTypes(); }

		if (toRefreshFilteredTickets) {
			setTicketsFiltered(tickets.filter(ticket => 
				ticket.Seat.includes(seatChoice)
				&& ticket.AuthorLogin.includes(authorChoice)
				&& (statusChoice === 'success' ? ticket.Resolved : (statusChoice === 'inProgress' ? !ticket.Resolved : ticket))
				&& (Number(issueTypeChoice) !== -1 ? (ticket.Type === Number(issueTypeChoice)) : ticket)
			));
			setToRefreshFilteredTickets(false);
		}

		if (ticketsFiltered) {
			setTicketsToShow(ticketsFiltered.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage));
		} else {
			setTicketsToShow([]);
		}
	}, [getTicketsAndTypes, currentPage, ticketsFiltered, tickets, authorChoice, seatChoice, statusChoice, issueTypeChoice, toRefreshFilteredTickets]);

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
