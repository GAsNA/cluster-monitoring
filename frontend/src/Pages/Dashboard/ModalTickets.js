import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spacer } from '@nextui-org/react';
import FormTicket from './FormTicket.js';
import ListTickets from '../../Components/ListTickets.js';

function ModalTickets({ open, setOpen, seat, cluster, setSelectedSeat, issueTypes, tickets }) {
	function close() {
		setSelectedSeat();
		setOpen(false);
	}

	const isMobile = useMediaQuery({ query: `(max-width: 800px)` });

	return (
		<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="5xl"
			style={{ background:'#231f20', color: 'white' }}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div>Report a technical issue on <span style={{ color: '#01babc' }}>{seat.id}</span></div>
				</ModalHeader>

				<ModalBody style={{ borderTop: 'solid white 1px', borderBottom: 'solid white 1px' }}>
					<div className="flex items-center flex-wrap">

						<div style={{ width: isMobile ? '100%' : '39%', display: "inline-block" }}>
							<FormTicket seat={seat} cluster={cluster} issueTypes={issueTypes} closeModal={close} />
						</div>

						<Spacer x={2}/>

						<div style={{ width: isMobile ? '100%' : '59%', display: "inline-block", maxHeight: '340px', overflow: 'auto', padding: '1%'}}>
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
