import React, { useState, useCallback } from 'react';
import { Button } from '@nextui-org/react';
import { deleteCluster } from '../../../utils/functionsAction.js';
import TicketCluster from './TicketCluster.js';
import ModalCluster from './ModalCluster.js';
import ModalConfirmation from '../../../Components/ModalConfirmation.js';

function ManageClusters({ tickets, clusters, setClusters }) {
	const [openModalCluster, setOpenModalCluster] = useState(false);
	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	const [cluster, setCluster] = useState();

	const sendDeleteCluster  = useCallback(() => {
		deleteCluster(cluster)
			.then(function(d) {
				if (d.err !== null) { return }
				setClusters(clusters.filter(function(c) { return c.ID !== cluster.ID }))
			})
	}, [cluster, clusters, setClusters])

	return (
		<>
			<Button color="primary" onPress={setOpenModalCluster}>Add a cluster</Button>

			<ModalCluster open={openModalCluster} setOpen={setOpenModalCluster} clusters={clusters}
				setClusters={setClusters} cluster={cluster} setCluster={setCluster}
			/>

			<div style={{ display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'start', marginTop: '1%' }}>

				{ clusters.map((item) => (
					<div key={item.ID}>
						<TicketCluster cluster={item} tickets={tickets} setCluster={setCluster}
							setOpenModalCluster={setOpenModalCluster}
							setOpenModalConfirmation={setOpenModalConfirmation}
						/>
					</div>
				))}

			</div>

			<ModalConfirmation open={openModalConfirmation} action={sendDeleteCluster}
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
