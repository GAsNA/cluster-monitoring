import React from 'react';
import { Card, CardBody } from '@nextui-org/react';

function ErrorCard({ title, description }) {
	return (
		<Card style={{ background: '#e96a64', color: 'white' }}>
			<CardBody>
				<p>
					<b>{title}</b>
					<br/>
					{description}
				</p>
			</CardBody>
		</Card>
	);
}

export default ErrorCard;
