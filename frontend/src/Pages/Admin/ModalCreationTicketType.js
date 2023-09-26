import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';
import ModalConfirmation from '../../Components/ModalConfirmation.js';

function ModalCreationTicketType({ open, setOpen, ticketTypes }) {
	const [name, setName] = useState("");

	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
	const [sending, setSending] = useState(false);

	function onNameChange(value) {
		setName(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
	}

	function close() {
		setOpen(false);
	}

	function areYouSure() {
		setOpenModalConfirmation(true);
	}

	async function create() {
		setSending(true);
		await client.post(API_ROUTES.CREATE_TICKET_TYPE, { "Name": name })
				.then((response) => {
					console.log(response.data)
					toast.success('Ticket type successfully created');
				})
				.catch((error) => {
					toast.error('An error occured');
				})
		setSending(false);
		close();
	}

	return (
		<>
			<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="xl" style={{ background:'#231f20', color: 'white' }}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<p>Want to create a <span style={{ color: '#01babc' }}>new type?</span></p>
					</ModalHeader>

					<ModalBody>
						<div className="flex h-auto items-center">
							<Input label="Name" style={{ color: 'black' }} onValueChange={onNameChange} />
						</div>
					</ModalBody>

					<ModalFooter>
						<Button style={{ background: '#01babc', color: 'white' }}
							onPress={ticketTypes.find((item) => item.Name === name) ? areYouSure : create}
							isLoading={sending}
						>Create</Button>
						<Button style={{ background: '#e96a64', color: 'white' }} onPress={close}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation}
				action={create}
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to create this ticket type?
						<br />This ticket type name <span style={{ color: '#01babc' }}>already exsists</span>.
					</p>
			/>
		</>
	);
}

export default ModalCreationTicketType;
