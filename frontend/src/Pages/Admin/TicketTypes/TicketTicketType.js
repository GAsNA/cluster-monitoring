import React from 'react';
import { Card, CardHeader, DropdownItem } from '@nextui-org/react';
import OptionButton from '../../../Components/OptionButton.js';

function TicketTicketType({ ticketType, tickets, setTicketType, setOpenModalTicketType, setOpenModalConfirmation }) {
	function actionsModify(type) {
		setTicketType(type);
		setOpenModalTicketType(true);
	}

	function actionsDelete(type) {
		setTicketType(type);
		setOpenModalConfirmation(true);
	}
	
	return (
		<Card key={ticketType.ID} style={{ padding: '1%', marginBottom: '2%', background: '#231f20', color: 'white', marginRight: '1%' }}>
			<CardHeader className="justify-between">
				<div>
					{ ticketType.Name.length > 12 ?
						ticketType.Name.slice(0, 9) + "..."
						:
						ticketType.Name
					}
				</div>

				<div>
					<span style={{ color: '#01babc' }}>
						{ (tickets.filter(ticket => ticket.TypeID === ticketType.ID)).length }
					</span> tickets
				</div>

				<OptionButton dropdownItems={[
					<DropdownItem textValue="modify" key="modify" onPress={() => actionsModify(ticketType)}>
						Modify
					</DropdownItem>,
					<DropdownItem textValue="delete" key="delete" style={{ color: '#e96a64' }}
						onPress={() => actionsDelete(ticketType)}
					>
						Delete
					</DropdownItem>
				]} />
			</CardHeader>
		</Card>
	);
}

export default TicketTicketType;
