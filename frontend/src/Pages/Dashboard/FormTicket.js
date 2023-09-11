import React, { useState } from 'react';
import { Select, SelectItem, Textarea, Spacer, Button, Card, CardBody } from '@nextui-org/react';

function FormTicket({ seat, issueTypes }) {
	const defaultIssueTypeID = issueTypes ? (issueTypes[0].ID).toString() : ""

	const [ticketType, setTicketType] = useState(new Set([defaultIssueTypeID]));
	const [comment, setComment] = useState("");

	function send() {
		console.log(ticketType);
		console.log(comment);
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
