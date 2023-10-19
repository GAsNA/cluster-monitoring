import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Spacer } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';
import ModalConfirmation from '../../Components/ModalConfirmation.js';

function ModalCluster({ open, setOpen, clusters, cluster, setCluster }) {
	const [name, setName] = useState("");
	const [link, setLink] = useState("");

	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
	const [sending, setSending] = useState(false);

	const action = cluster ? modify : create;

	function onNameChange(value) {
		setName(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase())
	}

	function close() {
		setCluster();
		setName("");
		setLink("");
		setOpen(false);
	}

	function areYouSure() {
		setOpenModalConfirmation(true);
	}

	function send() {
		if (name === "" || link === "") { return }
		
		if (clusters.find((item) => item.Name === name)) {
			areYouSure();
		} else {
			action();
		}
	}

	async function create() {
		setSending(true);
		await client.post(API_ROUTES.CREATE_CLUSTER, { "Name": name, "Link": link })
				.then((response) => {
					console.log(response.data)
					toast.success('Cluster successfully created');
				})
				.catch((error) => {
					toast.error('An error occured');
				})
		setSending(false);
		close();
	}

	async function modify() {
		setSending(true);
		await client.put(API_ROUTES.UPDATE_CLUSTER + cluster.ID, { "Name": name, "Link": link })
				.then((response) => {
					console.log(response.data)
					toast.success('Cluster successfully updated');
				})
				.catch((error) => {
					toast.error('An error occured');
				})
		setSending(false);
		close();
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
