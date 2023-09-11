import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from '@nextui-org/react';
import FormTicket from './FormTicket.js';
import Tickets from './Tickets.js';

function ModalTickets({ open, setOpen, seat, issueTypes }) {
	function close() {
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
							<FormTicket seat={seat} issueTypes={issueTypes} />
						</div>

						<Divider orientation="vertical" />

						<div style={{width: "60%", display: "inline-block", marginLeft: '1%', maxHeight: '340px', overflow: 'auto', padding: '1%'}}>
							<Tickets date="11/09/2023" type="Internet" resolved={true}/>
							<Tickets date="10/09/2023" type="Fan" comment="Bruit infernal" />
							<Tickets date="25/08/2023" type="Other" comment="Je mets un commentaire a rallonge pour tester. Et blablabla... J'ecris pour ecrire, dans le vide ; je ne dis rien, je ne raconte rien." resolved={true} />
							<Tickets date="14/08/2023" type="Internet" />
							<Tickets date="10/08/2023" type="Keyboard" resolved={true} />
							<Tickets date="30/07/2023" type="Mouse" />
							<Tickets date="30/07/2023" type="Keyboard" comment="pad numerique" />
							<Tickets date="28/07/2023" type="Mouse" />
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
