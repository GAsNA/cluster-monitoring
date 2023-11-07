import React from 'react';
import { Card, CardHeader, DropdownItem } from '@nextui-org/react';
import OptionButton from '../../../Components/OptionButton.js';

function TicketCluster({ cluster, tickets, setCluster, setOpenModalCluster, setOpenModalConfirmation }) {
	
	function actionsModify(item) {
		setCluster(item);
		setOpenModalCluster(true);
	}

	function actionsDelete(item) {
		setCluster(item);
		setOpenModalConfirmation(true);
	}
	
	return (
		<Card style={{ padding: '1%', marginBottom: '2%', background: '#231f20', color: 'white', marginRight: '1%' }}>
			<CardHeader className="justify-between">
				<div>
					{ cluster.Name }
				</div>

				<div>
					<span style={{ color: '#01babc' }}>
						{ (tickets.filter(ticket => ticket.Seat.toLowerCase().startsWith(cluster.Name.toLowerCase()))).length }
					</span> tickets
				</div>

				<OptionButton dropdownItems={[
					<DropdownItem textValue="modify" key="modify" onPress={() => actionsModify(cluster)}>
						Modify
					</DropdownItem>,
					<DropdownItem textValue="delete" key="delete" style={{ color: '#e96a64' }} onPress={() => actionsDelete(cluster)}>
						Delete
					</DropdownItem>
				]} />
			</CardHeader>
		</Card>
	);
}

export default TicketCluster;
