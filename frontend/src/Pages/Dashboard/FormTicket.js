import React from 'react';
import { Select, SelectItem, Textarea, Spacer, Button } from '@nextui-org/react';

function FormTicket({ seat }) {
	const possibleIssues = [
		"Fan",
		"Internet",
		"Screen",
		"Mouse",
		"Keyboard",
		"Other possibles issues blablabla",
		"Other",
	]

	function send() {
	}

	return (
		<>
			<Select disallowEmptySelection defaultSelectedKeys={[possibleIssues[0]]} placeholder="Select an animal" labelPlacement="outside" label={<span style={{ color: 'white' }}>Type of issue</span>} style={{ color: 'black' }}>
				{ possibleIssues.map((possibleIssue) => (
					<SelectItem textValue={possibleIssue} key={possibleIssue}>{possibleIssue}</SelectItem>
				)) }
			</Select>

			<Spacer y={4} />

			<Textarea label={<span style={{ color: 'white' }}>Comment</span>} labelPlacement="outside" placeholder="If you want to add something..." style={{ color: 'black' }} />
			
			<Spacer y={4} />

			<Button style={{ background: '#01babc', color: 'white' }} onPress={send}>Send Ticket</Button>
		</>
	);
}

export default FormTicket;
