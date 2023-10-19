import React, { useState } from 'react';
import { Button, Card, CardHeader, DropdownItem } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { client } from '../../utils/common.jsx';
import { API_ROUTES } from '../../utils/constants.jsx';
import ModalCluster from './ModalCluster.js';
import ModalConfirmation from '../../Components/ModalConfirmation.js';
import OptionButton from '../../Components/OptionButton.js';

function ManageClusters({ tickets, clusters }) {
	const [openModalCluster, setOpenModalCluster] = useState(false);
	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	const [cluster, setCluster] = useState();

	async function deleteCluster() {
		await client.delete(API_ROUTES.DELETE_CLUSTER + cluster.ID)
				.then((response) => {
					toast.success('Cluster deleted!');
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	function actionsModify(item) {
		setCluster(item);
		setOpenModalCluster(true);
	}

	function actionsDelete(item) {
		setCluster(item);
		setOpenModalConfirmation(true);
	}

	return (
		<>
			<Button color="primary" onPress={setOpenModalCluster}>Add a cluster</Button>

			<ModalCluster open={openModalCluster} setOpen={setOpenModalCluster} clusters={clusters}
				cluster={cluster} setCluster={setCluster}
			/>

			<div style={{ display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'start', marginTop: '1%' }}>

				{ clusters.map((item) => (
					<Card key={item.ID} style={{ padding: '1%', marginBottom: '2%', background: '#231f20', color: 'white', marginRight: '1%' }}>
						<CardHeader className="justify-between">
							<div>
								{ item.Name }
							</div>

							<div>
								<span style={{ color: '#01babc' }}>
									{ (tickets.filter(ticket => ticket.Seat.toLowerCase().startsWith(item.Name.toLowerCase()))).length }
								</span> tickets
							</div>

							<OptionButton dropdownItems={[
								<DropdownItem textValue="modify" key="modify" onPress={() => actionsModify(item)}>
									Modify
								</DropdownItem>,
								<DropdownItem textValue="delete" key="delete" style={{ color: '#e96a64' }}
									onPress={() => actionsDelete(item)}
								>
									Delete
								</DropdownItem>
							]} />
						</CardHeader>
					</Card>
				))}

			</div>

			<ModalConfirmation open={openModalConfirmation} action={deleteCluster}
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to delete this cluster?
					<br/>This will delete <b><span style={{ color: '#01babc' }}>ALL</span></b> associated tickets.
					<br/>This action is irreversible.
				</p>
				close={() => {setCluster(); setOpenModalConfirmation(false)}}
			/>
		</>
	);
}

export default ManageClusters;
