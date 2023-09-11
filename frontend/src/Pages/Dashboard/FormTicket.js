import React from 'react';
import { Select, SelectItem, Textarea, Spacer, Button } from '@nextui-org/react';

function FormTicket({ seat, issueTypes }) {
	function send() {
	}

	return (
		<>
			<Select disallowEmptySelection defaultSelectedKeys={[(issueTypes[0].ID).toString()]} placeholder="Select a issue type" labelPlacement="outside" label={<span style={{ color: 'white' }}>Type of issue</span>} style={{ color: 'black' }}>
				{ issueTypes.map((issueType) => (
					<SelectItem textValue={issueType.Name} key={issueType.ID}>{issueType.Name}</SelectItem>
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
