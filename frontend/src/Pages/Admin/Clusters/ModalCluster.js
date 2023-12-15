import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Spacer } from '@nextui-org/react';
import { createCluster, modifyCluster } from '../../../utils/functionsAction.js';
import ModalConfirmation from '../../../Components/ModalConfirmation.js';

function ModalCluster({ open, setOpen, clusters, setClusters, cluster, setCluster }) {
	const [name, setName] = useState("");
	const [link, setLink] = useState("");

	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
	const [sending, setSending] = useState(false);

	const action = cluster ? 
					() => modifyCluster(cluster, name, link, clusters, setClusters, setSending, close)
					:
					() => createCluster(name, link, clusters, setSending, close);

	function onNameChange(value) {
		setName(value.charAt(0).toUpperCase() + value.slice(1))
	}

	function close() {
		setCluster();
		setName("");
		setLink("");
		setOpen(false);
	}

	function send() {
		if (name === "" || link === "") { return }
		
		if (clusters.find((item) => item.Name === name)) {
			setOpenModalConfirmation(true);
		} else {
			action();
		}
	}

	const handleKeyPress= (event) => {
		if (event.key === 'Enter') { send(); }
	}

	useEffect(() => {
		if (cluster) { setName(cluster.Name); setLink(cluster.Link); }
		else { setName(""); setLink(""); }
	}, [cluster]);

	return (
		<>
			<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="xl" style={{ background:'#231f20', color: 'white' }}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						{ cluster ?
							<p>Want to modify this <span style={{ color: '#01babc' }}>cluster</span>?</p>
							:
							<p>Want to create a <span style={{ color: '#01babc' }}>new cluster</span>?</p>
						}
					</ModalHeader>

					<ModalBody>
						<div className="flex h-auto items-center" style={{ display: 'inline-block' }}>
							<Input label="Name" style={{ color: 'black' }} onValueChange={onNameChange}
								value={name}
								onKeyPress={handleKeyPress}
								autoFocus
							/>
							
							<Spacer y={4} />

							<Input label="Link of the SVG" style={{ color: 'black' }} onValueChange={setLink}
								value={link}
								onKeyPress={handleKeyPress}
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
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to create this cluster?
						<br />This cluster name <span style={{ color: '#01babc' }}>already exsists</span>.
					</p>
			/>
		</>
	);
}

export default ModalCluster;
