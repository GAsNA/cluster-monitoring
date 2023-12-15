import React, { useState, useEffect, useRef } from 'react';
import { Input, Pagination, Select, SelectItem, RadioGroup, Radio } from '@nextui-org/react';
import { getTickets } from '../../../utils/functionsAction.js';
import ListTickets from '../../../Components/ListTickets.js';

function TicketsSort({ ticketTypes=[] }) {
	const [tickets, setTickets] = useState([]);

	const limitPerPage = 30;
	const [totalPages, setTotalPages] = useState(1);
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
	const [ticketTypesForSelect, setTicketTypesForSelect] = useState([{ID: -1, Name: 'All'}, ...ticketTypes]);
	const orderByDate = [
		{ name: "Desc", key: 'desc' }, 
		{ name: "Asc", key: 'asc' },
	];

	const refFilterSection = useRef(null);	

	useEffect(() => {
		setTicketTypesForSelect([{ID: -1, Name: 'All'}, ...ticketTypes]);
	}, [ticketTypes])

	useEffect(() => {
		let resolvedChoice = ""
		if (statusChoice === "resolved") { resolvedChoice = "true" }
		else if (statusChoice === "inProgress") { resolvedChoice = "false" }

		let typeChoice = ""
		if (ticketTypeChoice !== "-1") {
			let typeChoiceObject = ticketTypes.find((tt) => Number(ticketTypeChoice) === tt.ID)
			if (typeChoiceObject) { typeChoice = typeChoiceObject.Name }
		}

		getTickets(seatChoice, orderByDateChoice, limitPerPage, currentPage, authorChoice, resolvedChoice, typeChoice)
			.then(function(d) {
				setTotalPages(d.totalPages);
				setTickets(d.data);
			})
	}, [currentPage, seatChoice, authorChoice, statusChoice, ticketTypeChoice, orderByDateChoice, ticketTypes]);

	return (
		<>
			<div ref={refFilterSection} style={{ margin: '20px 0' }}>
				<div style={{ display: 'flex', flexWrap: 'wrap' }}>

					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Input key="seat" label="Seat" labelPlacement="outside"
							isClearable onValueChange={setSeatChoice}/>
					</div>

					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Input key="author" label="Author" labelPlacement="outside"
							isClearable onValueChange={setAuthorChoice}/>
					</div>

					<div style={{ width: '200px', margin: '15px 1%' }}>
						<Select disallowEmptySelection defaultSelectedKeys={[statusTypes[0].key]} label="Status"
							labelPlacement="outside" onSelectionChange={(val) => setStatusChoice([...val][0])} >
								{ statusTypes.map((status) => (
									<SelectItem textValue={status.name} key={status.key}>{status.name}</SelectItem>
								))}
						</Select>
					</div>

					<div style={{ width: '200px', margin: '15px 1%' }}>
						<Select disallowEmptySelection defaultSelectedKeys={[(ticketTypesForSelect[0].ID).toString()]}
							label="Ticket types" labelPlacement="outside"
							onSelectionChange={(val) => setTicketTypeChoice([...val][0])}
						>
								{ ticketTypesForSelect.map((type) => (
									<SelectItem textValue={type.Name} key={type.ID}>{type.Name}</SelectItem>
								))}
						</Select>
					</div>
					
					<RadioGroup label="Order by date" orientation="horizontal" value={orderByDateChoice}
						onValueChange={setOrderByDateChoice}
					>
						{ orderByDate.map((order) => (
							<Radio key={order.key} value={order.key}>{order.name}</Radio>
						))}
					</RadioGroup>

				</div>

				{ totalPages > 1 &&
					<Pagination total={totalPages} onChange={setCurrentPage} />
				}
			</div>
			
			<div>
				<ListTickets tickets={tickets} setTickets={setTickets} displaySeat />
			</div>
		</>
	);
}

export default TicketsSort;
