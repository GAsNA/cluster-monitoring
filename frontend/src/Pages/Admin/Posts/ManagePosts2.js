import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import ModalPosts from './ModalPosts.js';
import { Card, Typography } from "@material-tailwind/react";

function ManagePosts2({ posts, setPosts, clusters }) {
	const [openModalPosts, setOpenModalPosts] = useState(false);

	const columns = ["MAC ADDRESS", "SERIAL NUMBER", "SEAT", "CLUSTER", "ACTIONS"];

	return (
		<>
			<div style={{ margin: '20px 0' }}>
			
				<Button color="primary" onPress={setOpenModalPosts}>Add posts</Button>

				<div style={{ marginTop: '1%' }}>
					<Card className="h-full w-full overflow-scroll"
						style={{ background: '#18181b', borderRadius: "0.5rem", padding: '10px' }}
					>
						<table className="w-full min-w-max table-auto text-left" style={{ fontSize: "0.875rem", lineHeight: "1.25rem" }}>
							<thead style={{ fontSize: "0.75rem", lineHeight: "1rem" }}>
								<tr>
									{columns.map((head) => (
										<th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
											<Typography variant="small" color="blue-gray"
												className="font-normal leading-none opacity-70"
											>
												{head}
											</Typography>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{posts.map((item, index) => {
									const classes = "p-4"; 
									return (
										<tr key={item.ID}>
											<td className={classes}>
												<Typography variant="small" color="blue-gray" className="font-normal">
													{item.Mac}
												</Typography>
											</td>
											<td className={classes}>
												<Typography variant="small" color="blue-gray" className="font-normal">
													{item.Serial}
												</Typography>
											</td>
											<td className={classes}>
												<Typography variant="small" color="blue-gray" className="font-normal">
													{item.Seat}
												</Typography>
											</td>
											<td className={classes}>
												<Typography variant="small" color="blue-gray" className="font-normal">
													{item.ClusterID}
												</Typography>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Card>

					{/*<Table aria-label="table posts">
						<TableHeader columns={columns}>
							{(column) => 
								<TableColumn key={column.key}>{column.label}</TableColumn>
							}
						</TableHeader>

						<TableBody emptyContent={"No registered posts."}>
							{posts.map((item) => (
								<TableRow key={item.ID}>
									{ columns.map((column) => (
										<TableCell style={{ maxWidth: '200px' }}>
											<RenderCell item={item} column={column} clusters={clusters} posts={posts} setPosts={setPosts}/>
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>*/}
				</div>

			</div>

			<ModalPosts open={openModalPosts} setOpen={setOpenModalPosts} />
		</>
	);
} 

/*function RenderCell({item, column, clusters, posts, setPosts}) {
	const cellValue = item[column.key];

	const [mac, setMac] = useState(item.Mac);
	const [serial, setSerial] = useState(item.Serial);
	const [seat, setSeat] = useState(item.Seat);
	const [clusterID, setClusterID] = useState(item.ClusterID);


	function changeClusterID(val) {
		setClusterID(Number([...val][0]))
	}

	function sendToModifyPost() {
		const p = { ID: item.ID, Mac: mac, Serial: serial, Seat: seat, ClusterID: clusterID }
		modifyPost(p, posts, setPosts)
	}

	switch (column.key) {
		case "Mac":
			return (
				<div style={{ maxWidth: '200px' }}>
					<Input value={mac} onValueChange={setMac} variant="underlined" />
				</div>
			);
		case "Serial":
			return (
				<div style={{ maxWidth: '200px' }}>
					<Input value={serial} onValueChange={setSerial} variant="underlined"/>
				</div>
			);
		case "Seat":
			return (
				<div style={{ maxWidth: '200px' }}>
					<Input value={seat} onValueChange={setSeat} variant="underlined"/>
				</div>
			);
		case "ClusterID":
			return (
				<div style={{ width: '200px' }}>
					<Select selectedKeys={clusterID !== 0 ? [clusterID.toString()] : []}
						variant="underlined" size="sm" onSelectionChange={changeClusterID}
						aria-label="select cluster"
					>
						{ clusters.map((cluster) => (
							<SelectItem texteValue={cluster.Name} key={cluster.ID}>{cluster.Name}</SelectItem>
						))}
					</Select>
				</div>
			);
		case "Actions":
			return (
				<div className="relative flex items-center gap-2">
					<Tooltip color="success" content="Save">
						<Button isIconOnly variant="light" onPress={sendToModifyPost}>
							<span className="text-lg cursor-pointer active:opacity-50">
								<SaveIcon />
							</span>
						</Button>
					</Tooltip>
					<Tooltip color="danger" content="Delete">
						<Button isIconOnly variant="light">
							<span className="text-lg text-danger cursor-pointer active:opacity-50">
								<DeleteIcon />
							</span>
						</Button>
					</Tooltip>
				</div>
			);
		default:
			return cellValue;
	}
}

function ClusterIDCell({ item, clusters, postsModified, setPostsModified }) {
	const itemInPostsModified = postsModified.find(p => { return p.ID === item.ID })

	function change(val) {
		const arr = postsModified.map(p => {
			return p.ID === item.ID ? { ...p, ClusterID: Number([...val][0]) } : p;
		});
		setPostsModified(arr);
	}

	/*const seatOfTheItem = itemInPostsModified.Seat
	React.useEffect(() => {
		const newCluster = clusters.find(c => { return seatOfTheItem.toLowerCase().startsWith(c.Name.toLowerCase()) })
		if (newCluster) {
			setPostsModified(postsModified.map(p => {return p.ID === item.ID ? { ...p, ClusterID: newCluster.ID } : p;}));
		} else {
			setPostsModified(postsModified.map(p => {return p.ID === item.ID ? { ...p, ClusterID: 0 } : p;}));
		}
		// eslint-disable-next-line
	}, [seatOfTheItem, clusters])*/

/*	return (
		<div style={{ width: '200px' }}>
			<Select selectedKeys={itemInPostsModified.ClusterID !== 0 ? [itemInPostsModified.ClusterID.toString()] : []}
				variant="underlined" size="sm" onSelectionChange={change} aria-label="select cluster"
			>
				{ clusters.map((cluster) => (
					<SelectItem texteValue={cluster.Name} key={cluster.ID}>{cluster.Name}</SelectItem>
				))}
			</Select>
		</div>
	);
}*/

export default ManagePosts2;
