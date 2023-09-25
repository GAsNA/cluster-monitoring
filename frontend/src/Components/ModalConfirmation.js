import React from 'react';
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from '@nextui-org/react';

function ModalConfirmation({ open, setOpen, action, text }) {
	function close() {
		setOpen(false);
	}

	function yesToSend() {
		action();
		close();
	}

	return (
		<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" style={{ background:'#231f20', color: 'white', padding: '1% 0 .5% 0' }}>
			<ModalContent>
				<ModalBody>
					{text}
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
