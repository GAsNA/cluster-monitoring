import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { Card, Typography } from "@material-tailwind/react";
import { toast } from 'react-hot-toast';
import ModalPosts from './ModalPosts.js';
import ModalConfirmation from '../../../Components/ModalConfirmation.js';
import { API_ROUTES } from '../../../utils/constants.jsx';
import { client } from '../../../utils/common.jsx';
import { modifyPost, deletePost } from '../../../utils/functionsAction.js';
import { DeleteIcon } from '../../../Icon/DeleteIcon';
import { SaveIcon } from '../../../Icon/SaveIcon';

function ManagePosts2({ clusters }) {
	const [posts, setPosts] = useState([]);
	const [openModalPosts, setOpenModalPosts] = useState(false);

	const columns = ["MAC ADDRESS", "SERIAL NUMBER", "SEAT", "CLUSTER", "ACTIONS"];

	const [init, setInit] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);

	async function getPosts() {
		setIsLoading(true);

		await client.get(API_ROUTES.GET_POSTS + "?limit=10&page=" + currentPage)
				.then((response) => {
					if (response.data.length === 0) { setHasMore(false) }
					setPosts(prevItems => [...prevItems, ...response.data]);
					setCurrentPage(prevPage => prevPage + 1);
				})
				.catch((error) => {
					toast.error('An error occured');
				})

		setIsLoading(false);
	}

	useEffect(() => {
		if (init) { setInit(false); getPosts(); }
		// eslint-disable-next-line
	}, [init]);

	function handleScroll() {
		const documentElement = document.documentElement;
		if (documentElement.clientHeight + documentElement.scrollTop !== documentElement.scrollHeight
			|| isLoading || !hasMore)
		{
			return;
		}
		getPosts();
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
		modifyPost(newPost, posts, setPosts)
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
				action={() => deletePost(post, posts, setPosts)}
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to delete this post?
					<br/>This action is irreversible.
				</p> />
		</tr>
	);
}

export default ManagePosts2;
