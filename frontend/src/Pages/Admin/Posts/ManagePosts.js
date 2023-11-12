import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem, Tooltip, Button } from '@nextui-org/react';
import ModalPosts from './ModalPosts.js';
import { modifyPost, deletePost } from '../../../utils/functionsAction.js';
import { DeleteIcon } from '../../../Icon/DeleteIcon';
import { SaveIcon } from '../../../Icon/SaveIcon';

function ManagePosts({ posts, setPosts, clusters }) {
	const [postsModified, setPostsModified] = useState(posts);

	const [openModalPosts, setOpenModalPosts] = useState(false);

	const columns = [
		{ key: "Mac", label: "MAC ADDRESS", },
		{ key: "Serial", label: "SERIAL NUMBER", },
		{ key: "Seat", label: "SEAT", },
		{ key: "ClusterID", label: "CLUSTER", },
		{ key: "Actions", label: "ACTIONS", },
	];

	function renderCell(item, columnKey) {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "Mac":
				return (<MacCell item={item} postsModified={postsModified} setPostsModified={setPostsModified} />);
			case "Serial":
				return (<SerialCell item={item} postsModified={postsModified} setPostsModified={setPostsModified} />);
			case "Seat":
				return (<SeatCell item={item} postsModified={postsModified} setPostsModified={setPostsModified} />);
			case "ClusterID":
				return (<ClusterIDCell item={item} clusters={clusters} postsModified={postsModified} setPostsModified={setPostsModified} />);
			case "Actions":
				return (<ActionsCell item={item} postsModified={postsModified} setPostsModified={setPostsModified} posts={posts} setPosts={setPosts} />);
			default:
				return cellValue;
		}
	}

	return (
		<>
			<div style={{ margin: '20px 0' }}>
			
				<Button color="primary" onPress={setOpenModalPosts}>Add posts</Button>

				<div style={{ marginTop: '1%' }}>
					<Table aria-label="table posts">
						<TableHeader columns={columns}>
							{(column) => 
								<TableColumn key={column.key}>{column.label}</TableColumn>
							}
						</TableHeader>

						<TableBody emptyContent={"No registered posts."}>
							{postsModified.map((item) => (
								<TableRow key={item.ID}>
									{ (columnKey) => (
										<TableCell style={{ maxWidth: '200px' }}>
											{renderCell(item, columnKey)}
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

			</div>

			<ModalPosts open={openModalPosts} setOpen={setOpenModalPosts} />
		</>
	);
}

function MacCell({ item, postsModified, setPostsModified }) {
	const itemInPostsModified = postsModified.find(p => { return p.ID === item.ID })

	function change(val) {
		const arr = postsModified.map(p => {
			return p.ID === item.ID ? { ...p, Mac: val } : p;
		});
		setPostsModified(arr);
	}

	return (
		<div style={{ maxWidth: '200px' }}>
			<Input value={itemInPostsModified.Mac} onValueChange={change} variant="underlined" />
		</div>
	);
}

function SerialCell({ item, postsModified, setPostsModified }) {
	const itemInPostsModified = postsModified.find(p => { return p.ID === item.ID })
	
	function change(val) {
		const arr = postsModified.map(p => {
			return p.ID === item.ID ? { ...p, Serial: val } : p;
		});
		setPostsModified(arr);
	}

	return (
		<div style={{ maxWidth: '200px' }}>
			<Input value={itemInPostsModified.Serial} onValueChange={change} variant="underlined"/>
		</div>
	);
}

function SeatCell({ item, postsModified, setPostsModified }) {
	const itemInPostsModified = postsModified.find(p => { return p.ID === item.ID })
	
	function change(val) {
		const arr = postsModified.map(p => {
			return p.ID === item.ID ? { ...p, Seat: val } : p;
		});
		setPostsModified(arr);
	}

	return (
		<div style={{ maxWidth: '200px' }}>
			<Input value={itemInPostsModified.Seat} onValueChange={change} variant="underlined"/>
		</div>
	);
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

	return (
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
}

function ActionsCell({ item, postsModified, setPostsModified, posts, setPosts }) {
	return (
		<div className="relative flex items-center gap-2">
			<Tooltip color="success" content="Save">
				<Button isIconOnly variant="light" onPress={() => modifyPost(item, postsModified, posts, setPosts)}>
					<span className="text-lg cursor-pointer active:opacity-50">
						<SaveIcon />
					</span>
				</Button>
			</Tooltip>
			<Tooltip color="danger" content="Delete">
				<Button isIconOnly variant="light" onPress={() => deletePost(item, postsModified, setPostsModified, posts, setPosts)}>
					<span className="text-lg text-danger cursor-pointer active:opacity-50">
						<DeleteIcon />
					</span>
				</Button>
			</Tooltip>
		</div>
	);
}

export default ManagePosts;
