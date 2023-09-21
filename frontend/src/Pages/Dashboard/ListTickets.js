import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import Ticket from './Ticket.js';

function ListTickets({ tickets, issueTypes }) {
	
	return (
		<>
		{
			tickets ?
				tickets.map((ticket, index) => (
					<div key={index}>
						<Ticket ticket={ticket}
								type={(issueTypes.find((it) => ticket.Type === it.ID )).Name} 
						/>
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
