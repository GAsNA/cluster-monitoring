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
				return (<SerialCell item={item} />);
			case "Seat":
				return (<SeatCell item={item} />);
			case "ClusterID":
				return (<ClusterIDCell item={item} clusters={clusters} />);
			case "Actions":
				return (
					<div className="relative flex items-center gap-2">
						<Tooltip color="success" content="Save post">
							<Button isIconOnly variant="light" onPress={() => modifyPost(item, newPosts, posts, setPosts)}>
								<span className="text-lg cursor-pointer active:opacity-50">
									<SaveIcon />
								</span>
							</Button>
						</Tooltip>
						<Tooltip color="danger" content="Delete post">
							<Button isIconOnly variant="light" onPress={() => deletePost(item, posts, setPosts)}>
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

	return (
		<div style={{ margin: '20px 0' }}>

			<Table>
				<TableHeader columns={columns}>
					{(column) => 
						<TableColumn key={column.key}>{column.label}</TableColumn>
					}
				</TableHeader>

				<TableBody items={newPosts} emptyContent={"No registered posts."}>
					{(item) => (
						<TableRow key={item.ID}>
							{ (columnKey) => (
								<TableCell style={{ maxWidth: '200px' }}>
									{renderCell(item, columnKey)}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>

		</div>
	);
}

function MacCell({ item, newPosts, setNewPosts }) {

	const [mac, setMac] = useState(newPosts.find(p => { return p.ID === item.ID }).Mac)

	function change(val) {
		const arr = newPosts.map(p => {
			if (p.ID === item.ID) {
				return { ...p, Mac: val };
			} else {
				return p;
			}
		});
		console.log(arr);
		setNewPosts(arr);
		setMac(val);
	}

	return (
		<div style={{ maxWidth: '200px' }}>
			<Input value={mac} onValueChange={(val) => change(val)} variant="underlined" />
		</div>
	);
}

function SerialCell({ item }) {
	return (
		<div style={{ maxWidth: '200px' }}>
			<Input defaultValue={item.Serial} variant="underlined"/>
		</div>
	);
}

function SeatCell({ item }) {
	return (
		<div style={{ maxWidth: '200px' }}>
			<Input defaultValue={item.Seat} variant="underlined"/>
		</div>
	);
}

function ClusterIDCell({ item, clusters }) {
	return (
		<div style={{ width: '200px' }}>
			<Select defaultSelectedKeys={item.ClusterID !== 0 ? [item.ClusterID.toString()] : []}
				variant="underlined" size="sm"
			>
				{ clusters.map((cluster) => (
					<SelectItem texteValue={cluster.Name} key={cluster.ID}>{cluster.Name}</SelectItem>
				))}
			</Select>
		</div>
	);
}

export default ManagePosts;