import React from 'react';
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from '@nextui-org/react';

function ModalConfirmation({ open, setOpen, setToSend }) {
	function close() {
		setOpen(false);
	}

	function yesToSend() {
		setToSend(true);
		close();
	}

	return (
		<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" style={{ background:'#231f20', color: 'white', padding: '1% 0 .5% 0' }}>
			<ModalContent>
				<ModalBody>
					<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to send this ticket ?</p>
				</ModalBody>

				<ModalFooter>
					<Button style={{ background: '#2cd57a', color: 'white' }} onPress={yesToSend}>Absolutely</Button>
					<Button style={{ background: '#e96a64', color: 'white' }} onPress={close}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default ModalConfirmation;
