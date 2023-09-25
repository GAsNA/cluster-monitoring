import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, User, Link } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { client } from '../utils/common.jsx';
import { URL_INTRA_PROFILES, API_ROUTES } from '../utils/constants.jsx';
import {SettingIcon} from '../Icon/SettingIcon';
import ModalConfirmation from './ModalConfirmation';

const resolvedColor = '#2cd57a';
const inProgressColor = '#c1c1c9';
const resolvedText = 'Resolved';
const inProgressText = 'In progress';

function Ticket({ ticket, displaySeat=false }) {
	const user = JSON.parse(localStorage.getItem("user"))

	function getDateFormated(dateStr) {
		var date = new Date(dateStr)
		return (date.getDate() + "/" + parseInt(date.getMonth() + 1) + "/" + date.getFullYear())
	}

	return (
		<Card style={{ padding: '2%', marginBottom: '2%', background: 'white', color: 'black' }}>
			<CardHeader className="justify-between">
				{ user && user.IsStaff && ticket.AuthorLogin &&
					<Link href={ URL_INTRA_PROFILES + ticket.AuthorID } isExternal className="text-black">
						<User name={ticket.AuthorLogin} avatarProps={{ src: ticket.AuthorImage }} />
					</Link>
				}

				{ displaySeat &&
					<b><span style={{ color: '#01babc' }}>{ticket.Seat}</span></b>
				}

				<div className="flex gap-5">
					<div className="flex flex-col gap-1 items-start justify-center">
						<h4 className="font-semibold leading-none">
							{ticket.TicketTypeName}
							<span className="ml-2 text-small tracking-tight text-default-400">{getDateFormated(ticket.CreatedAt)}</span>
						</h4>
					</div>
				</div>

				{ ticket.Resolved ?
					<Chip style={{ background: resolvedColor, color: 'white' }}>{resolvedText}</Chip>
					:
					<Chip style={{ background: inProgressColor, color: 'white' }}>{inProgressText}</Chip>
				}

				{ user && user.IsStaff &&
					<DropdownOptions ticket={ticket} isResolved={ticket.Resolved} />
				}
			</CardHeader>

			<CardBody className="px-3 py-0 text-small text-default-400" style={{ color: '#5b5c61' }}>
				{ticket.Comment}
			</CardBody>
		</Card>
	);
}

function DropdownOptions({ ticket, isResolved }) {
	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	function areYouSure() {
		setOpenModalConfirmation(true);
	}

	async function changeStatus() {
		await client.put(API_ROUTES.UPDATE_TICKET + ticket.ID, { "Resolved": !isResolved })
			.then((response) => {
				toast.success('Ticket status changed!');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
	}

	async function deleteTicket() {
		await client.delete(API_ROUTES.DELETE_TICKET + ticket.ID)
			.then((response) => {
				toast.success('Ticket deleted!');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
	}

	return (
		<>
			<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation}
				action={deleteTicket}
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to delete this ticket?
					<br/>This action is irreversible.
				</p>
			/>

			<Dropdown placement="bottom-end">
				<DropdownTrigger>
					<Button isIconOnly variant="faded" aria-label="Settings" style={{ background: 'white' }}>
						<SettingIcon />
					</Button>    
				</DropdownTrigger>

				<DropdownMenu aria-label="Ticket Action">
					<DropdownItem textValue="set as" key="set_resolved" color={ !isResolved ? "success" : "default" }
						onAction={changeStatus}
					>
						Set as { !isResolved ? resolvedText : inProgressText }
					</DropdownItem>
					<DropdownItem textValue="delete" key="delete" style={{ color: '#e96a64' }}
						onAction={areYouSure}
					>
						Delete
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</>
	 )
}

export default Ticket;
