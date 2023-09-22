import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from '@nextui-org/react';
import FormTicket from './FormTicket.js';
import ListTickets from '../../Components/ListTickets.js';

function ModalTickets({ open, setOpen, seat, setSelectedSeat, issueTypes, tickets }) {
	function close() {
		setSelectedSeat();
		setOpen(false);
	}

	return (
		<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="5xl" style={{ background:'#231f20', color: 'white' }}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div>Report a technical issue on <span style={{ color: '#01babc' }}>{seat.id}</span></div>
				</ModalHeader>

				<ModalBody style={{ borderTop: 'solid white 1px', borderBottom: 'solid white 1px' }}>
					<div className="flex h-auto items-center">

						<div style={{width: "40%", display: "inline-block", marginRight: '1%'}}>
							<FormTicket seat={seat} issueTypes={issueTypes} closeModal={close} />
						</div>

						<Divider orientation="vertical" />

						<div style={{width: "60%", display: "inline-block", marginLeft: '1%', maxHeight: '340px', overflow: 'auto', padding: '1%'}}>
							<ListTickets tickets={tickets} />
						</div>

					</div>
				</ModalBody>

				<ModalFooter>
					<Button style={{ background: '#e96a64', color: 'white' }} onPress={close}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default ModalTickets;
