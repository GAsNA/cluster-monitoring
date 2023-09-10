import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, Select, SelectItem, Textarea, Spacer } from '@nextui-org/react';

function ModalTickets({ open, setOpen, seat }) {
	function close() {
		setOpen(false);
	}

	const possibleIssues = [
		"Fan",
		"Internet",
		"Screen",
		"Mouse",
		"Keyboard",
		"Other possibles issues blablabla",
		"Other",
	]

	return (
		<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="5xl">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div>Report a technical issue on <span style={{ color: '#01babc' }}>{seat.id}</span></div>
				</ModalHeader>

				<ModalBody className="border border-solid border-black">
					<div className="flex h-auto items-center">

						<div style={{width: "50%", display: "inline-block", marginRight: '1%'}}>
							<Select disallowEmptySelection defaultSelectedKeys={[possibleIssues[0]]} placeholder="Select an animal" labelPlacement="outside" label="Type of issue" className="max-w-xs">
								{ possibleIssues.map((possibleIssue) => (
									<SelectItem key={possibleIssue}>{possibleIssue}</SelectItem>
								)) }
							</Select>
							<Spacer y={4} />
							<Textarea label="Comment" labelPlacement="outside" placeholder="If you want to add something..." className="max-w-xs" />

							<Button color="primary" style={{ marginTop: '15px' }} onPress={close}>Action</Button>
						</div>

						<Divider orientation="vertical" />

						<div style={{width: "50%", marginLeft: '1%', display: 'flex', justifyContent: 'center'}}>
							LIST OF TICKETS
						</div>

					</div>
				</ModalBody>

				<ModalFooter>
					<Button color="danger" variant="light" onPress={close}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default ModalTickets;
