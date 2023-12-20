import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardBody, Chip, DropdownItem, User, Link, Spacer } from '@nextui-org/react';
import { URL_INTRA_PROFILES } from '../utils/constants.jsx';
import { updateTicket, deleteTicket } from '../utils/functionsAction.js';
import ModalConfirmation from './ModalConfirmation';
import OptionButton from './OptionButton';

function Ticket({ ticket, tickets, setTickets, displaySeat=false }) {
	const user = JSON.parse(localStorage.getItem("user"))

	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	const resolvedColor = '#2cd57a';
	const inProgressColor = '#c1c1c9';
	const resolvedText = 'Resolved';
	const inProgressText = 'In progress';

	const formatedDate = useMemo(() => {
		var date = new Date(ticket.CreatedAt)
		return (date.getDate() + "/" + parseInt(date.getMonth() + 1) + "/" + date.getFullYear())
	}, [ticket.CreatedAt]);

	const sendUpdateTicket = useCallback(() => {
		updateTicket({ "ID": ticket.ID, "Resolved": !ticket.Resolved })
			.then(function(d) {
				if (d.err !== null) { return }
				const newTickets = tickets.map((t) => {
					if (t.ID === d.data.ID) {
						t.Resolved = d.data.Resolved;
						t.ResolvedAt = d.data.ResolvedAt;
						t.ResolvedByID = d.data.ResolvedByID;
					}
					return t;
				})
				setTickets(newTickets);
			})
	}, [ticket.ID, ticket.Resolved, tickets, setTickets]);

	const sendDeleteTicket = useCallback(() => {
		deleteTicket(ticket)
			.then(function(d) {
				if (d.err !== null) { return }
				setTickets(tickets.filter(function(t) { return t.ID !== ticket.ID }))
			})
	}, [ticket, tickets, setTickets])

	return (
		<Card style={{ padding: '2%', marginBottom: '2%', background: 'white', color: 'black' }}>
			<CardHeader className="justify-between" style={{ display: 'flex', flexWrap: 'wrap' }}>
				{ user && user.IsStaff && ticket.AuthorLogin &&
					<>
						{ ticket.AuthorIDIntra !== "0" ?
							<Link href={ URL_INTRA_PROFILES + ticket.AuthorIDIntra } isExternal className="text-black">
								<User name={ticket.AuthorLogin} avatarProps={{ src: ticket.AuthorImage }} />
							</Link>
							:
							<User name={ticket.AuthorLogin} avatarProps={{ src: ticket.AuthorImage }} />
						}
				
						<Spacer />
					</>
				}


				{ displaySeat &&
					<>
						<b><span style={{ color: '#01babc' }}>{ticket.Seat}</span></b>
						
						<Spacer />
					</>
				}

				<div className="flex gap-5">
					<div className="flex flex-col gap-1 items-start justify-center">
						<h4 className="font-semibold leading-none">
							{ ticket.TicketTypeName.length > 12 ?
								ticket.TicketTypeName.slice(0, 9) + "..."
								:
								ticket.TicketTypeName
							}
							<span className="ml-2 text-small tracking-tight text-default-400">{formatedDate}</span>
						</h4>
					</div>
				</div>

				<Spacer />

				{ ticket.Resolved ?
					<Chip style={{ background: resolvedColor, color: 'white' }}>{resolvedText}</Chip>
					:
					<Chip style={{ background: inProgressColor, color: 'white' }}>{inProgressText}</Chip>
				}

				{ user && user.IsStaff &&
					<>
						<Spacer />
						
						<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation}
							action={sendDeleteTicket}
							text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to delete this ticket?
								<br/>This action is irreversible.
							</p>
						/>
						
						<OptionButton color="black" dropdownItems={[
							<DropdownItem textValue="set as" key="set_resolved" color={ !ticket.Resolved ? "success" : "default" }
								onPress={sendUpdateTicket}
							>
								Set as { !ticket.Resolved ? resolvedText : inProgressText }
							</DropdownItem>,
							<DropdownItem textValue="delete" key="delete" style={{ color: '#e96a64' }}
								onPress={() => setOpenModalConfirmation(true)}
							>
								Delete
							</DropdownItem>
						]} />
					</>
				}
			</CardHeader>

			<CardBody className="px-3 py-0 text-small text-default-400" style={{ color: '#5b5c61' }}>
				{ticket.Comment}
			</CardBody>
		</Card>
	);
}

export default Ticket;
