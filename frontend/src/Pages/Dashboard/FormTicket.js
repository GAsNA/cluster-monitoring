import React, { useState, useEffect } from 'react';
import { Select, SelectItem, Textarea, Spacer, Button, Card, CardBody } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';
import ModalConfirmation from './ModalConfirmation.js';

function FormTicket({ seat, issueTypes, closeModal }) {
	const defaultIssueTypeID = issueTypes ? (issueTypes[0].ID).toString() : ""

	const [ticketType, setTicketType] = useState(new Set([defaultIssueTypeID]));
	const [comment, setComment] = useState("");

	const [ openModalConfirmation, setOpenModalConfirmation ] = useState(false);

	const [ toSend, setToSend ] = useState(false);

	async function areYouSure() {
		setOpenModalConfirmation(true);
	}

	async function send() {
		await client.post(API_ROUTES.CREATE_TICKET, { "Seat": seat.id, "Type": parseInt([...ticketType][0]), "Comment": comment, "AuthorID": 1 })
				.then((response) => {
					console.log(response.data);
					toast.success('Ticket successfully sent');
				})
				.catch((error) => {
					toast.error('An error occured');
					throw error
				});

		closeModal();
	}

	useEffect(() => {
		if (toSend) { send(); }
	});

	return (
		<>
		{ issueTypes ?
			<>
				<Select disallowEmptySelection defaultSelectedKeys={[defaultIssueTypeID]} placeholder="Select a issue type" labelPlacement="outside" label={<span style={{ color: 'white' }}>Type of issue</span>} style={{ color: 'black' }} onSelectionChange={setTicketType}>
					{ issueTypes.map((issueType) => (
						<SelectItem textValue={issueType.Name} key={issueType.ID}>{issueType.Name}</SelectItem>
					)) }
				</Select>

				<Spacer y={4} />

				<Textarea label={<span style={{ color: 'white' }}>Comment</span>} labelPlacement="outside" placeholder="If you want to add something..." style={{ color: 'black' }} onValueChange={setComment} />
			
				<Spacer y={4} />

				<Button style={{ background: '#01babc', color: 'white' }} onPress={areYouSure}>Send Ticket</Button>

				<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation} setToSend={setToSend} />
			</>
		:
			<Card style={{ background: '#e96a64', color: 'white' }}>
				<CardBody>
					<p><b>To send a ticket:</b><br />No issue types availables. Try again later.</p>
				</CardBody>
			</Card>
		}
		</>
	);
}

export default FormTicket;
