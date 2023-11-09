import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from '@nextui-org/react';
import { createTicketType, modifyTicketType } from '../../../utils/functionsAction.js';
import ModalConfirmation from '../../../Components/ModalConfirmation.js';

function ModalTicketType({ open, setOpen, ticketTypes, ticketType, setTicketType }) {
	const [name, setName] = useState("");

	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
	const [sending, setSending] = useState(false);

	const action = ticketType ?
					() => modifyTicketType(ticketType, name, setSending, close)
					:
					() => createTicketType(name, ticketTypes, setSending, close);

	function onNameChange(value) {
		setName(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
	}

	function close() {
		setTicketType();
		setName("");
		setOpen(false);
	}

	function areYouSure() {
		setOpenModalConfirmation(true);
	}

	function send() {
		if (name === "") { return }

		if (ticketTypes.find((item) => item.Name === name)) {
			areYouSure();
		} else {
			action();
		}
	}

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') { send(); }
	}

	useEffect(() => {
		if (ticketType) { setName(ticketType.Name); }
		else { setName(""); }
	}, [ticketType]);

	return (
		<>
			<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="xl" style={{ background:'#231f20', color: 'white' }}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						{ ticketType ?
							<p>Want to modify this <span style={{ color: '#01babc' }}>type</span>?</p>
							:
							<p>Want to create a <span style={{ color: '#01babc' }}>new type</span>?</p>
						}
					</ModalHeader>

					<ModalBody>
						<div className="flex h-auto items-center">
							<Input label="Name" style={{ color: 'black' }} onValueChange={onNameChange}
								value={name}
								onKeyPress={handleKeyPress}
								autoFocus
							/>
						</div>
					</ModalBody>

					<ModalFooter>
						<Button style={{ background: '#01babc', color: 'white' }}
							onPress={send}
							isLoading={sending}
						>Send</Button>
						<Button style={{ background: '#e96a64', color: 'white' }} onPress={close}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation}
				action={action}
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to create this ticket type?
						<br />This ticket type name <span style={{ color: '#01babc' }}>already exsists</span>.
					</p>
			/>
		</>
	);
}

export default ModalTicketType;
