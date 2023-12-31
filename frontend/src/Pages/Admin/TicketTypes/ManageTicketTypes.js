import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { deleteTicketType } from '../../../utils/functionsAction.js';
import TicketTicketType from './TicketTicketType.js';
import ModalTicketType from './ModalTicketType.js';
import ModalConfirmation from '../../../Components/ModalConfirmation.js';

function ManageTicketTypes({ tickets, ticketTypes, setTicketTypes }) {
	const [openModalTicketType, setOpenModalTicketType] = useState(false);
	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	const [ticketType, setTicketType] = useState();

	function sendToDeleteTicketType() {
		deleteTicketType(ticketType)
			.then(function(d) {
				if (d.err !== null) { return }
				setTicketTypes(ticketTypes.filter(function(tt) { return tt.ID !== ticketType.ID }))
			})
	}

	return (
		<>
			<Button color="primary" onPress={setOpenModalTicketType}>Add a type</Button>

			<ModalTicketType open={openModalTicketType} setOpen={setOpenModalTicketType} ticketTypes={ticketTypes}
				setTicketTypes={setTicketTypes} ticketType={ticketType} setTicketType={setTicketType}
			/>

			<div style={{ display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'start', marginTop: '1%' }}>

				{ ticketTypes.map((type) => (
					<div key={type.ID}>
						<TicketTicketType ticketType={type} tickets={tickets} setTicketType={setTicketType}
							setOpenModalTicketType={setOpenModalTicketType}
							setOpenModalConfirmation={setOpenModalConfirmation}
						/>
					</div>
				))}

			</div>

			<ModalConfirmation open={openModalConfirmation} action={sendToDeleteTicketType}
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
