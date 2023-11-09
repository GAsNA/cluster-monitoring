import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem, Tooltip, Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { client } from '../../../utils/common.jsx';
import { API_ROUTES } from '../../../utils/constants.jsx';
import { DeleteIcon } from '../../../Icon/DeleteIcon';
import { SaveIcon } from '../../../Icon/SaveIcon';

function ManagePosts({ posts, setPosts, clusters }) {
	const columns = [
		{ key: "Mac", label: "MAC ADDRESS", },
		{ key: "Serial", label: "SERIAL NUMBER", },
		{ key: "Seat", label: "SEAT", },
		{ key: "ClusterID", label: "CLUSTER", },
		{ key: "Actions", label: "ACTIONS", },
	];

	async function deletePost(post) {
		await client.delete(API_ROUTES.DELETE_POST + post.ID)
				.then((response) => {
					setPosts(posts.filter(function(p) { return p.ID !== post.ID }))
					toast.success('Post deleted!');
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	function renderCell(item, columnKey) {
		const cellValue = item[columnKey];

		switch (columnKey) {
			case "Mac":
				return (
					<div style={{ maxWidth: '200px' }}>
						<Input defaultValue={item.Mac} variant="underlined"/>
					</div>
				);
			case "Serial":
				return (
					<div style={{ maxWidth: '200px' }}>
						<Input defaultValue={item.Serial} variant="underlined"/>
					</div>
				);
			case "Seat":
				return (
					<div style={{ maxWidth: '200px' }}>
						<Input defaultValue={item.Seat} variant="underlined"/>
					</div>
				);
			case "ClusterID":
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
			case "Actions":
				return (
					<div className="relative flex items-center gap-2">
						<Tooltip color="success" content="Save post">
							<Button isIconOnly variant="light">
								<span className="text-lg cursor-pointer active:opacity-50">
									<SaveIcon />
								</span>
							</Button>
						</Tooltip>
						<Tooltip color="danger" content="Delete post">
							<Button isIconOnly variant="light" onPress={() => deletePost(item)}>
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

				<TableBody items={posts} emptyContent={"No registered posts."}>
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

export default ManagePosts;
