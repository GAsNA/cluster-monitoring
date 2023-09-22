import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import Ticket from './Ticket.js';

function ListTickets({ tickets, displaySeat=false }) {
	
	return (
		<>
		{
			tickets && tickets.length > 0 ?
				tickets.map((ticket, index) => (
					<div key={index}>
						<Ticket ticket={ticket} displaySeat={displaySeat} />
					</div>
				))
			:
			<Card style={{ background: '#c1c1c9', color: 'white' }}>
				<CardBody>
					<b>No ticket for now</b>
				</CardBody>
			</Card>
		}
		</>
	);
}

export default ListTickets;
