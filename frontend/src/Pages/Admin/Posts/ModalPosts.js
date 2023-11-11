import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Spacer } from '@nextui-org/react';

function ModalPosts({ open, setOpen }) {
	const [postsToCreate, setPostsToCreate] = useState([]);

	const [sending, setSending] = useState(false);

	function close() {
		setOpen(false);
	}

	function send() {
		// if one of the element have mac or serial empty, return
		
		// send
	}

	return (
		<>
			<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="5xl" style={{ background:'#231f20', color: 'white' }}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<p>Want to create some <span style={{ color: '#01babc' }}>posts</span>?</p>
					</ModalHeader>

					<ModalBody>
						<div className="flex h-auto items-center" style={{ display: 'inline-block' }}>
							{/*<Input label="Name" style={{ color: 'black' }} onValueChange={onNameChange}
								value={name}
								onKeyPress={handleKeyPress}
								autoFocus
							/>*/}
							
							<Spacer y={4} />

							{/*<Input label="Link of the SVG" style={{ color: 'black' }} onValueChange={setLink}
								value={link}
								onKeyPress={handleKeyPress}
							/>*/}
						</div>
					</ModalBody>

					<ModalFooter>
						<Button style={{ background: '#01babc', color: 'white' }} onPress={send} isLoading={sending}>
							Send
						</Button>
						<Button style={{ background: '#e96a64', color: 'white' }} onPress={close}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default ModalPosts;
