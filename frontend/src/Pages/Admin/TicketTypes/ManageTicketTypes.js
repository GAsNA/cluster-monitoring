import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { client } from '../../../utils/common.jsx';
import { API_ROUTES } from '../../../utils/constants.jsx';
import TicketTicketType from './TicketTicketType.js';
import ModalTicketType from './ModalTicketType.js';
import ModalConfirmation from '../../../Components/ModalConfirmation.js';

function ManageTicketTypes({ tickets, issueTypes }) {
	const [openModalTicketType, setOpenModalTicketType] = useState(false);
	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	const [ticketType, setTicketType] = useState();

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
			<Button color="primary" onPress={setOpenModalTicketType}>Add a type</Button>

			<ModalTicketType open={openModalTicketType} setOpen={setOpenModalTicketType} ticketTypes={issueTypes}
				ticketType={ticketType} setTicketType={setTicketType}
			/>

			<div style={{ display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'start', marginTop: '1%' }}>

				{ issueTypes.map((type) => (
					<div key={type.ID}>
						<TicketTicketType ticketType={type} tickets={tickets} setTicketType={setTicketType}
							setOpenModalTicketType={setOpenModalTicketType}
							setOpenModalConfirmation={setOpenModalConfirmation}
						/>
					</div>
				))}

			</div>

			<ModalConfirmation open={openModalConfirmation} action={deleteTicketType}
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to delete this ticket type?
					<br/>This will delete <b><span style={{ color: '#01babc' }}>ALL</span></b> associated tickets.
					<br/>This action is irreversible.
				</p>
				close={() => {setTicketType(); setOpenModalConfirmation(false)}}
			/>
		</>
	);
}

export default ManageTicketTypes;
