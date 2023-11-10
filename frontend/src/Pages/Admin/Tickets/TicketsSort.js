import React, { useState, useEffect, useRef } from 'react';
import { Input, Pagination, Select, SelectItem, RadioGroup, Radio } from '@nextui-org/react';
import ListTickets from '../../../Components/ListTickets.js';

function TicketsSort({ tickets=[], ticketTypes=[] }) {
	const [ticketsFiltered, setTicketsFiltered] = useState(tickets);
	const [ticketsToShow, setTicketsToShow] = useState(ticketsFiltered);

	const limitPerPage = 30;
	const [currentPage, setCurrentPage] = useState(1);

	const [seatChoice, setSeatChoice] = useState("");
	const [authorChoice, setAuthorChoice] = useState("");
	const [statusChoice, setStatusChoice] = useState('all');
	const [ticketTypeChoice, setTicketTypeChoice] = useState(-1);
	const [orderByDateChoice, setOrderByDateChoice] = useState('desc');
	
	const statusTypes = [
		{ name: "All", key: 'all' }, 
		{ name: "Resolved", key: 'resolved' },
		{ name: "In progress", key: 'inProgress' }
	];
	const [ticketTypesForSelect, setTicketTypesForSelect] = useState([]);
	const orderByDate = [
		{ name: "Desc", key: 'desc' }, 
		{ name: "Asc", key: 'asc' },
	];

	const [getTickets, setGetTickets] = useState(false);
	const [getTicketTypesForSelect, setGetTicketTypesForSelect] = useState(false);
	const [toRefreshFilteredTickets, setToRefreshFilteredTickets] = useState(true);

	const refFilterSection = useRef(null);	
	
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

	function onTicketTypeChoiceChange(value) {
		setTicketTypeChoice([...value][0]);
		setToRefreshFilteredTickets(true);
	}

	function onOrderByDateChoiceChange(value) {
		setOrderByDateChoice(value);
		setToRefreshFilteredTickets(true);
	}

	useEffect(() => {
		if (!getTickets && tickets.length > 0) { setGetTickets(true); setTicketsFiltered(tickets); }
		if (!getTicketTypesForSelect && ticketTypes.length > 0) { 
			setGetTicketTypesForSelect(true); 
			var data = [{ID: -1, Name: "All"}, ...ticketTypes]
			setTicketTypesForSelect(data);
		}

		if (toRefreshFilteredTickets) {
			var newTicketsFiltered = tickets.filter(ticket => 
				ticket.Seat.toLowerCase().includes(seatChoice)
				&& ticket.AuthorLogin.toLowerCase().includes(authorChoice)
				&& (statusChoice === 'resolved' ? ticket.Resolved : (statusChoice === 'inProgress' ? !ticket.Resolved : ticket))
				&& (Number(ticketTypeChoice) !== -1 ? (ticket.TypeID === Number(ticketTypeChoice)) : ticket)
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
	}, [getTickets, getTicketTypesForSelect, currentPage, ticketsFiltered, tickets, ticketTypes, authorChoice, seatChoice, statusChoice, ticketTypeChoice, orderByDateChoice, toRefreshFilteredTickets]);

	return (
		<>
			<div ref={refFilterSection} style={{ margin: '20px 0' }}>
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
								{ statusTypes.map((status) => (
									<SelectItem textValue={status.name} key={status.key}>{status.name}</SelectItem>
								))}
						</Select>
					</div>

					<div style={{ width: '200px', margin: '15px 1%' }}>
						{ ticketTypesForSelect && ticketTypesForSelect.length > 0 &&
						<Select disallowEmptySelection defaultSelectedKeys={[(ticketTypesForSelect[0].ID).toString()]} label="Ticket types"
							labelPlacement="outside" onSelectionChange={onTicketTypeChoiceChange} >
								{ ticketTypesForSelect.map((type) => (
									<SelectItem textValue={type.Name} key={type.ID}>{type.Name}</SelectItem>
								))}
						</Select>
						}
					</div>
					
					<RadioGroup label="Order by date" orientation="horizontal" value={orderByDateChoice}
						onValueChange={onOrderByDateChoiceChange}
					>
						{ orderByDate.map((order) => (
							<Radio key={order.key} value={order.key}>{order.name}</Radio>
						))}
					</RadioGroup>

				</div>

				{ ticketsFiltered && ticketsFiltered.length > limitPerPage &&
					<Pagination total={Math.ceil(ticketsFiltered.length / limitPerPage)} onChange={setCurrentPage} />
				}
			</div>
			
			<div>
				<ListTickets tickets={ticketsToShow} setTickets={setTicketsToShow} displaySeat />
			</div>
		</>
	);
}

export default TicketsSort;
