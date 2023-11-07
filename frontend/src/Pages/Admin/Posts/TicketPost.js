import React, { useState } from 'react';
import { Card, CardHeader, Spacer, Button, Input, Select, SelectItem } from '@nextui-org/react';

function TicketPost({ post, clusters, setPost, setOpenModalConfirmation }) {

	const listClusters = [{ID: 0, Name: 'None'}].concat(clusters);

	const [mac, setMac] = useState(post.Mac);
	const [initialMac, setInitialMac] = useState(post.Mac);

	const [serial, setSerial] = useState(post.Serial);
	const [initialSerial, setInitialSerial] = useState(post.Serial);

	const [seat, setSeat] = useState(post.Seat);
	const [initialSeat, setInitialSeat] = useState(post.Seat);
	
	return (
		<Card style={{ padding: '2%', marginBottom: '2%', background: 'white', color: 'black' }}>
			<CardHeader className="justify-between" style={{ display: 'flex', flexWrap: 'wrap' }}>
				
				<div style={{ maxWidth: '400px' }}>
					<Input placeholder="MAC address" value={mac} onValueChange={setMac} variant="underlined"
						endContent={
							<ValidationButton isDisabled={mac === "" || mac === initialMac ? true : false} />
						}
					/>
				</div>

				<Spacer />

				<div style={{ maxWidth: '400px' }}>
					<Input placeholder="Serial number" value={serial} onValueChange={setSerial} variant="underlined"
						endContent={
							<ValidationButton isDisabled={serial === "" || serial === initialSerial ? true : false} />
						}
					/>
				</div>

				<Spacer />

				<div style={{ maxWidth: '400px', width: '200px' }}>
					<Select defaultSelectedKeys={post.ClusterID !== 0 ? [post.ClusterID.toString()] : []} placeholder="Cluster"
						size="sm" variant="underlined"
					>
						{ clusters.map((cluster) => (
							<SelectItem textValue={cluster.Name} key={cluster.ID}>{cluster.Name}</SelectItem>
						))}
					</Select>
				</div>

				<Spacer />

				<div style={{ maxWidth: '400px' }}>
					<Input placeholder="Seat" value={seat} onValueChange={setSeat} variant="underlined"
						endContent={
							<ValidationButton isDisabled={seat === initialSeat ? true : false} />
						}
					/>
				</div>
			
			</CardHeader>
		</Card>
	);
}

function ValidationButton({ isDisabled }) {

	return (
		<Button isIconOnly isDisabled={isDisabled} color="primary" size="sm" style={{ marginRight: '-8px' }}>
			✔️
		</Button>
	);

}

export default TicketPost;
