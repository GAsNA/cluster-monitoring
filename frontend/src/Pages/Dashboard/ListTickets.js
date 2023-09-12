import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import Ticket from './Ticket.js';

function ListTickets({ tickets, issueTypes }) {

	function getDateFormated(dateStr) {
		var date = new Date(dateStr)
		return (date.getDate() + "/" + parseInt(date.getMonth() + 1) + "/" + date.getFullYear())
	}
	
	return (
		<>
		{
			tickets ?
				tickets.map((ticket, index) => (
					<div key={index}>
						<Ticket date={getDateFormated(ticket.CreatedAt)}
								type={(issueTypes.find((it) => ticket.Type === it.ID )).Name} 
								resolved={ticket.Resolved}
								comment={ticket.Comment} />
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
