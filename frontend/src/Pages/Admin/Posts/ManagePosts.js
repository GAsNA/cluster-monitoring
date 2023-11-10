import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem, Tooltip, Button } from '@nextui-org/react';
import { modifyPost, deletePost } from '../../../utils/functionsAction.js';
import { DeleteIcon } from '../../../Icon/DeleteIcon';
import { SaveIcon } from '../../../Icon/SaveIcon';

function ManagePosts({ posts, setPosts, clusters }) {
	const [newPosts, setNewPosts] = useState(posts);

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
				return (<MacCell item={item} newPosts={newPosts} setNewPosts={setNewPosts} />);
			case "Serial":
				return (<SerialCell item={item} newPosts={newPosts} setNewPosts={setNewPosts} />);
			case "Seat":
				return (<SeatCell item={item} newPosts={newPosts} setNewPosts={setNewPosts} />);
			case "ClusterID":
				return (<ClusterIDCell item={item} clusters={clusters} newPosts={newPosts} setNewPosts={setNewPosts} />);
			case "Actions":
				return (<ActionsCell item={item} newPosts={newPosts} posts={posts} setPosts={setPosts} />);
			default:
				return cellValue;
		}
	}

	return (
		<div style={{ margin: '20px 0' }}>

			<Table>
				<TableHeader columns={columns}>
					{(column) => 
						<TableColumn key={column.key}>{column.label}</TableColumn>
					}
				</TableHeader>

				<TableBody emptyContent={"No registered posts."}>
					{newPosts.map((item) => (
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
	);
}

function MacCell({ item, newPosts, setNewPosts }) {
	const itemInNewPosts = newPosts.find(p => { return p.ID === item.ID })

	function change(val) {
		const arr = newPosts.map(p => {
			return p.ID === item.ID ? { ...p, Mac: val } : p;
		});
		setNewPosts(arr);
	}

	return (
		<div style={{ maxWidth: '200px' }}>
			<Input value={itemInNewPosts.Mac} onValueChange={change} variant="underlined" />
		</div>
	);
}

function SerialCell({ item, newPosts, setNewPosts }) {
	const itemInNewPosts = newPosts.find(p => { return p.ID === item.ID })
	
	function change(val) {
		const arr = newPosts.map(p => {
			return p.ID === item.ID ? { ...p, Serial: val } : p;
		});
		setNewPosts(arr);
	}

	return (
		<div style={{ maxWidth: '200px' }}>
			<Input value={itemInNewPosts.Serial} onValueChange={change} variant="underlined"/>
		</div>
	);
}

function SeatCell({ item, newPosts, setNewPosts }) {
	const itemInNewPosts = newPosts.find(p => { return p.ID === item.ID })
	
	function change(val) {
		const arr = newPosts.map(p => {
			return p.ID === item.ID ? { ...p, Seat: val } : p;
		});
		setNewPosts(arr);
	}

	return (
		<div style={{ maxWidth: '200px' }}>
			<Input value={itemInNewPosts.Seat} onValueChange={change} variant="underlined"/>
		</div>
	);
}

function ClusterIDCell({ item, clusters, newPosts, setNewPosts }) {
	const itemInNewPosts = newPosts.find(p => { return p.ID === item.ID })

	function change(val) {
		const arr = newPosts.map(p => {
			return p.ID === item.ID ? { ...p, ClusterID: Number([...val][0]) } : p;
		});
		setNewPosts(arr);
	}

	const seatOfTheItem = itemInNewPosts.Seat
	React.useEffect(() => {
		const newCluster = clusters.find(c => { return seatOfTheItem.toLowerCase().startsWith(c.Name.toLowerCase()) })
		if (newCluster) {
			setNewPosts(newPosts.map(p => {return p.ID === item.ID ? { ...p, ClusterID: newCluster.ID } : p;}));
		} else {
			setNewPosts(newPosts.map(p => {return p.ID === item.ID ? { ...p, ClusterID: 0 } : p;}));
		}
		// eslint-disable-next-line
	}, [seatOfTheItem, clusters, item.ID, setNewPosts])

	return (
		<div style={{ width: '200px' }}>
			<Select selectedKeys={itemInNewPosts.ClusterID !== 0 ? [itemInNewPosts.ClusterID.toString()] : []}
				variant="underlined" size="sm" onSelectionChange={change}
			>
				{ clusters.map((cluster) => (
					<SelectItem texteValue={cluster.Name} key={cluster.ID}>{cluster.Name}</SelectItem>
				))}
			</Select>
		</div>
	);
}

function ActionsCell({ item, newPosts, posts, setPosts }) {
	return (
		<div className="relative flex items-center gap-2">
			<Tooltip color="success" content="Save">
				<Button isIconOnly variant="light" onPress={() => modifyPost(item, newPosts, posts, setPosts)}>
					<span className="text-lg cursor-pointer active:opacity-50">
						<SaveIcon />
					</span>
				</Button>
			</Tooltip>
			<Tooltip color="danger" content="Delete">
				<Button isIconOnly variant="light" onPress={() => deletePost(item, posts, setPosts)}>
					<span className="text-lg text-danger cursor-pointer active:opacity-50">
						<DeleteIcon />
					</span>
				</Button>
			</Tooltip>
		</div>
	);
}

export default ManagePosts;
