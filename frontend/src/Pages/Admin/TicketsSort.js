import React, { useState, useEffect } from 'react';
import { Pagination } from '@nextui-org/react';
import toast from 'react-hot-toast';
import ListTickets from '../../Components/ListTickets.js';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';

function TicketsSort() {
	const [tickets, setTickets] = useState([
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 1, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 2, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 3, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 4, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 5, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 6, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 7, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 8, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 9, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 10, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 11, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 12, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 13, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 14, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 15, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 16, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 17, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 18, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 19, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 20, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 21, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 22, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 23, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 24, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 25, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 26, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 27, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 28, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 29, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 30, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 31, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 32, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 33, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 34, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 35, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
		{AuthorID: 135512, Comment: "test", CreatedAt: "2023-09-22T09:07:23.141351Z", ID: 36, Resolved: false,
			ResolvedAt: "0001-01-01T00:00:00Z", ResolvedByID: 135512, Seat: "bess-f1r1s6", Type: 1},
	]);
	const [ticketsFiltered, setTicketsFiltered] = useState(tickets);
	const [ticketsToShow, setTicketsToShow] = useState(ticketsFiltered);
	const [issueTypes, setIssueTypes] = useState([
		{ ID: 1, Name: 'Fan' }
	]);

	const limitPerPage = 30;
	const [currentPage, setCurrentPage] = React.useState(1);

	const [getTickets, setGetTickets] = useState(false);

	async function getAllTickets() {
		await client.get(API_ROUTES.GET_TICKETS)
				.then((response) => {
					setTickets(response.data);
					console.log(response.data)
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	useEffect(() => {
		//if (!getTickets) { setGetTickets(true); getAllTickets(); }
		setTicketsToShow(ticketsFiltered.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage));
	}, [getTickets, currentPage, ticketsFiltered]);

	return (
		<>
			<div style={{ marginBottom: '1%' }}>
				<Pagination showControls total={Math.ceil(ticketsFiltered.length / limitPerPage)} onChange={setCurrentPage} />
			</div>
			
			<div style={{ height: '95%', overflow: 'auto' }}>
				<ListTickets tickets={ticketsToShow} issueTypes={issueTypes} displaySeat />
			</div>
		</>
	);
}

export default TicketsSort;
