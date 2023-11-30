import React, { useState } from 'react';
import { Button, Input, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { Card, Typography } from "@material-tailwind/react";
import ModalPosts from './ModalPosts.js';
import { modifyPost, deletePost } from '../../../utils/functionsAction.js';
import { DeleteIcon } from '../../../Icon/DeleteIcon';
import { SaveIcon } from '../../../Icon/SaveIcon';

function ManagePosts2({ posts, setPosts, clusters }) {
	const [openModalPosts, setOpenModalPosts] = useState(false);

	const columns = ["MAC ADDRESS", "SERIAL NUMBER", "SEAT", "CLUSTER", "ACTIONS"];

	return (
		<>
			<div style={{ margin: '20px 0' }}>
			
				<Button color="primary" onPress={setOpenModalPosts}>Add posts</Button>

				<div style={{ marginTop: '1%' }}>
					<Card className="h-full w-full overflow-scroll"
						style={{ background: '#18181b', borderRadius: "0.5rem", padding: '10px 15px 15px 15px' }}
					>
						<table className="w-full min-w-max table-auto text-left"
							style={{ fontSize: "0.875rem", lineHeight: "1.25rem" }}
						>
							<thead style={{ fontSize: "0.75rem", lineHeight: "1rem" }}>
								<tr>
									{columns.map((column) => (
										<th key={column}
											className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
										>
											<Typography variant="small" color="blue-gray"
												className="font-normal leading-none opacity-70"
											>
												{column}
											</Typography>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{posts.map((post) => (
									<RowPost post={post} clusters={clusters} posts={posts} setPosts={setPosts} />
								))}
							</tbody>
						</table>
					</Card>
				</div>

			</div>

			<ModalPosts posts={posts} setPosts={setPosts} open={openModalPosts} setOpen={setOpenModalPosts} clusters={clusters} />
		</>
	);
} 

function RowPost({ post, clusters, posts, setPosts }) {
	const [mac, setMac] = useState(post.Mac);
	const [serial, setSerial] = useState(post.Serial);
	const [seat, setSeat] = useState(post.Seat);
	const [clusterID, setClusterID] = useState(post.ClusterID);

	function changeSeat(val) {
		// autocompletion for cluster
		const newCluster = clusters.find(c => { return val.toLowerCase().startsWith(c.Name.toLowerCase()) })
		if (newCluster) {
			setClusterID(newCluster.ID);
		} else {
			setClusterID(0);
		}

		setSeat(val);
	}

	function changeClusterID(val) {
		setClusterID(Number([...val][0]))
	}

	function sendToModifyPost() {
		const newPost = { ID: post.ID, Mac: mac, Serial: serial, Seat: seat, ClusterID: clusterID }
		modifyPost(newPost, posts, setPosts)
	}

	return (
		<tr key={post.ID}>
			<td className="p-2" style={{ maxWidth: "200px" }}>
				<Input value={mac} onValueChange={setMac} variant="underlined" />
			</td>
			<td className="p2" style={{ maxWidth: "200px" }}>
				<Input value={serial} onValueChange={setSerial} variant="underlined" />
			</td>
			<td className="p-2" style={{ maxWidth: "200px" }}>
				<Input value={seat} onValueChange={changeSeat} variant="underlined" />
			</td>
			<td className="p-2" style={{ width: "200px" }}>
				<Select selectedKeys={clusterID !== 0 ? [clusterID.toString()] : []} variant="underlined"
					size="sm" onSelectionChange={changeClusterID} aria-label="select cluster"
				>
					{ clusters.map((cluster) => (
						<SelectItem texteValue={cluster.Name} key={cluster.ID}>{cluster.Name}</SelectItem>
					))}
				</Select>
			</td>
			<td>
				<div className="relative flex items-center gap-2">
					<Tooltip color="success" content="Save">
						<Button isIconOnly variant="light" onPress={sendToModifyPost}>
							<span className="text-lg cursor-pointer active:opacity-50">
								<SaveIcon />
							</span>
						</Button>
					</Tooltip>
					<Tooltip color="danger" content="Delete">
						<Button isIconOnly variant="light" onPress={() => deletePost(post, posts, setPosts)}>
							<span className="text-lg text-danger cursor-pointer active:opacity-50">
								<DeleteIcon />
							</span>
						</Button>
					</Tooltip>
				</div>
			</td>
		</tr>
	);
}

export default ManagePosts2;
