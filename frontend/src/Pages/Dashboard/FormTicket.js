import React, { useState } from 'react';
import { Select, SelectItem, Textarea, Spacer, Button, Card, CardBody } from '@nextui-org/react';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';

function FormTicket({ seat, issueTypes, closeModal }) {
	const defaultIssueTypeID = issueTypes ? (issueTypes[0].ID).toString() : ""

	const [ticketType, setTicketType] = useState(new Set([defaultIssueTypeID]));
	const [comment, setComment] = useState("");

	async function send() {
		await client.post(API_ROUTES.CREATE_TICKET, { "Seat": seat.id, "Type": parseInt([...ticketType][0]), "Comment": comment, "AuthorID": 1 })
				.then((response) => {
					console.log(response.data);
					// MESSAGE VALIDATION
				})
				.catch((error) => {
					throw error
				});

		closeModal();
	}

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

				<Button style={{ background: '#01babc', color: 'white' }} onPress={send}>Send Ticket</Button>
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
