import React, { useState } from 'react';
import { Select, SelectItem, Textarea, Spacer, Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';
import ModalConfirmation from '../../Components/ModalConfirmation.js';
import ErrorCard from '../../Components/ErrorCard.js';

function FormTicket({ seat, cluster, issueTypes, closeModal }) {
	const defaultIssueTypeID = issueTypes ? (issueTypes[0].ID).toString() : ""

	const [ticketType, setTicketType] = useState(new Set([defaultIssueTypeID]));
	const [comment, setComment] = useState("");

	const [ openModalConfirmation, setOpenModalConfirmation ] = useState(false);

	const [ sending, setSending ] = useState(false);

	function areYouSure() {
		setOpenModalConfirmation(true);
	}

	async function send() {
		setSending(true);
		await client.post(API_ROUTES.CREATE_TICKET, { "Seat": seat.id, "ClusterID": cluster.ID, "TypeID": parseInt([...ticketType][0]), "Comment": comment, })
				.then((response) => {
					console.log(response.data);
					toast.success('Ticket successfully sent');
				})
				.catch((error) => {
					toast.error('An error occured');
				});

		setSending(false);
		closeModal();
	}
	
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') { send(); }
	}

	return (
		<>
		{ issueTypes ?
			<>
				<Select disallowEmptySelection defaultSelectedKeys={[defaultIssueTypeID]}
					placeholder="Select a issue type" labelPlacement="outside"
					label={<span style={{ color: 'white' }}>Type of issue</span>} style={{ color: 'black' }}
					onSelectionChange={setTicketType}
					autoFocus
				>
					{ issueTypes.map((issueType) => (
						<SelectItem textValue={issueType.Name} key={issueType.ID}>{issueType.Name}</SelectItem>
					)) }
				</Select>

				<Spacer y={4} />

				<Textarea label={<span style={{ color: 'white' }}>Comment</span>} maxRows={3}
						labelPlacement="outside" placeholder="If you want to add something..." 
						style={{ color: 'black' }} onValueChange={setComment} onKeyPress={handleKeyPress}
				/>
			
				<Spacer y={4} />

				<Button style={{ background: '#01babc', color: 'white' }} onPress={areYouSure}
					isLoading={sending}
				>
					Send Ticket
				</Button>

				<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation}
					action={send}
					text=<p><span style={{ color: '#01babc' }}>Are you sure</span>you want to send this ticket?</p>
				/>
			</>
		:
			<ErrorCard title="To send a ticket:" description="No issue types availables. Try again later." />
		}
		</>
	);
}

export default FormTicket;
