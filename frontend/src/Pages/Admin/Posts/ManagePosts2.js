import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { Card, Typography } from "@material-tailwind/react";
import ModalPosts from './ModalPosts.js';
import ModalConfirmation from '../../../Components/ModalConfirmation.js';
import { getPosts } from '../../../utils/functionsAction.js';
import { updatePost, deletePost } from '../../../utils/functionsAction.js';
import { DeleteIcon } from '../../../Icon/DeleteIcon';
import { SaveIcon } from '../../../Icon/SaveIcon';

function ManagePosts2({ clusters }) {
	const [posts, setPosts] = useState([]);
	const [openModalPosts, setOpenModalPosts] = useState(false);

	const columns = ["MAC ADDRESS", "SERIAL NUMBER", "SEAT", "CLUSTER", "ACTIONS"];

	const [macChoice, setMacChoice] = useState("");
	const [serialChoice, setSerialChoice] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	let [hasMore] = useState(true);
	let currentPage = 1;

	function sendGetPosts(isScrolling) {
		setIsLoading(true);

		getPosts("asc", "30", currentPage, macChoice, serialChoice)
			.then(function(d) {
				if (d.err !== null) { return }
				if (isScrolling) {
					setPosts(prevItems => [...prevItems, ...d.data])
				} else {
					setPosts(d.data)
				}
				if (d.totalPages.toString() === currentPage.toString()) { hasMore = false; }
				currentPage += 1
			})

		setIsLoading(false);
	}

	useEffect(() => {
		sendGetPosts(false);
		// eslint-disable-next-line
	}, [macChoice, serialChoice]);

	function handleScroll() {
		const documentElement = document.documentElement;
		if (documentElement.clientHeight + documentElement.scrollTop !== documentElement.scrollHeight
			|| isLoading || !hasMore)
		{
			return;
		}
		sendGetPosts(true);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
		// eslint-disable-next-line
	}, [isLoading]);

	return (
		<>
			<div style={{ margin: '20px 0' }}>
			
				<Button color="primary" onPress={setOpenModalPosts}>Add posts</Button>

				<div style={{ display: 'flex', flexWrap: 'wrap' }}>
					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Input key="mac" label="Mac address" labelPlacement="outside" isClearable
							value={macChoice} onValueChange={setMacChoice} />
					</div>

					<div style={{ maxWidth: '200px', margin: '15px 1%' }}>
						<Input key="serial" label="Serial number" labelPlacement="outside" isClearable
							value={serialChoice} onValueChange={setSerialChoice} />
					</div>
				</div>

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
								{ posts && posts.length > 0 ?
									posts.map((post) => (
										<RowPost key={post.ID} post={post} clusters={clusters} posts={posts} setPosts={setPosts} />
									))
									:
									<tr key="noPost">
										<td colSpan="5">
											<Typography variant="small" color="blue-gray"
												className="text-center font-normal leading-none opacity-70"
												style={{ marginTop: '1%' }}
											>
												No registered post.
											</Typography>
										</td>
									</tr>
								}
							</tbody>
						</table>
						{isLoading &&
							<Typography variant="small" color="blue-gray"
								className="text-center font-normal leading-none opacity-70"
								style={{ marginTop: '1%', fontSize: "0.875rem", lineHeight: "1.25rem" }}
							>
								Loading...
							</Typography>
						}
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

	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	// autocompletion for cluster
	function changeSeat(val) {
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
		if (mac === "" || serial === "") { return; }

		const newPost = { ID: post.ID, Mac: mac, Serial: serial, Seat: seat, ClusterID: clusterID }
		updatePost(newPost)
			.then(function(d) {
				if (d.err !== null) { return }
				const newPs = posts.map((p) => {
					if (p.ID === d.data.ID) { return d.data }
					return p;
				})
				setPosts(newPs);
			})
	}

	function sendToDeletePost() {
		deletePost(post)
			.then(function(d) {
				if (d.err !== null) { return }
				setPosts(posts.filter(function(p) { return p.ID !== post.ID }))
			})
	}
	
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') { sendToModifyPost(); }
	}

	return (
		<tr key={post.ID}>
			<td className="p-2" style={{ maxWidth: "200px" }}>
				<Input value={mac} isInvalid={mac === ""} onKeyPress={handleKeyPress} onValueChange={setMac} variant="underlined" />
			</td>
			<td className="p2" style={{ maxWidth: "200px" }}>
				<Input value={serial} isInvalid={serial === ""} onKeyPress={handleKeyPress} onValueChange={setSerial} variant="underlined" />
			</td>
			<td className="p-2" style={{ maxWidth: "200px" }}>
				<Input value={seat} onKeyPress={handleKeyPress} onValueChange={changeSeat} variant="underlined" />
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
						<Button isIconOnly variant="light" onPress={() => setOpenModalConfirmation(true)}>
							<span className="text-lg text-danger cursor-pointer active:opacity-50">
								<DeleteIcon />
							</span>
						</Button>
					</Tooltip>
				</div>
			</td>

			<ModalConfirmation open={openModalConfirmation} setOpen={setOpenModalConfirmation}
				action={sendToDeletePost}
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to delete this post?
					<br/>This action is irreversible.
				</p> />
		</tr>
	);
}

export default ManagePosts2;
