import React, { useState } from 'react';
import { Button, Card, CardHeader, DropdownItem } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';
import ModalCreationTicketType from './ModalCreationTicketType.js';
import ModalConfirmation from '../../Components/ModalConfirmation.js';
import OptionButton from '../../Components/OptionButton.js';

function ManageTicketTypes({ tickets, issueTypes }) {
	const [openModalCreation, setOpenModalCreation] = useState(false);
	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	const [ticketType, setTicketType] = useState();

	function areYouSure() {
		setOpenModalConfirmation(true);
	}

	async function deleteTicketType() {
		await client.delete(API_ROUTES.DELETE_TICKET_TYPE + ticketType.ID)
				.then((response) => {
					toast.success('Ticket type deleted!');
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	return (
		<>
			<Button color="primary" onPress={setOpenModalCreation}>Add a type</Button>

			<ModalCreationTicketType open={openModalCreation} setOpen={setOpenModalCreation} ticketTypes={issueTypes} />

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

							<OptionButton dropdownItems={[
								<DropdownItem textValue="modify" key="modify">
									Modify
								</DropdownItem>,
								<DropdownItem textValue="delete" key="delete" style={{ color: '#e96a64' }}
									onPress={() => setTicketType(type)} onAction={areYouSure}
								>
									Delete
								</DropdownItem>
							]} />
						</CardHeader>
					</Card>
				))}

				<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation}
					action={deleteTicketType}
					text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to delete this ticket type?
						<br/>This will delete <b><span style={{ color: '#01babc' }}>ALL</span></b> associated tickets.
						<br/>This action is irreversible.
					</p>
				/>
			</div>
		</>
	);
}

export default ManageTicketTypes;
