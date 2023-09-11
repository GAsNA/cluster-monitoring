import React from 'react';
import { Card, CardHeader, CardBody, Chip } from '@nextui-org/react';

function Tickets({ date, type, comment="", resolved=false }) {
	return (
		<Card style={{ padding: '2%', marginBottom: '2%' }}>
			<CardHeader className="justify-between">
				<div className="flex gap-5">
					<div className="flex flex-col gap-1 items-start justify-center">
						<h4 className="font-semibold leading-none">
							{type}
							<span className="ml-2 text-small tracking-tight text-default-400">{date}</span>
						</h4>
					</div>
				</div>

				{ resolved ?
					<Chip style={{ background: '#2cd57a', color: 'white' }}>Resolved</Chip>
					:
					<Chip style={{ background: '#c1c1c9', color: 'white' }}>In progress</Chip>
				}
			</CardHeader>

			<CardBody className="px-3 py-0 text-small text-default-400" style={{ color: '#5b5c61' }}>
				{comment}
			</CardBody>
		</Card>
	);
}

export default Tickets;
