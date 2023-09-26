import React from 'react';
import { Button, Card, CardHeader } from '@nextui-org/react';

function ManageTicketTypes({ tickets, issueTypes }) {
	return (
		<>
			<Button color="primary">Add a type</Button>

			<div style={{ display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'start', marginTop: '1%' }}>

				{ issueTypes.map((type) => (
					<Card key={type.ID} style={{ padding: '1%', marginBottom: '2%', background: '#231f20', color: 'white', marginRight: '1%' }}>
						<CardHeader className="justify-between">
							<div>
								{ type.Name }
							</div>

							<div>
								<span style={{ color: '#01babc' }}>
									{ (tickets.filter(ticket => ticket.Type === type.ID)).length }
								</span> asssociated tickets
							</div>
						</CardHeader>
					</Card>
				))}
			</div>
		</>
	);
}

export default ManageTicketTypes;
