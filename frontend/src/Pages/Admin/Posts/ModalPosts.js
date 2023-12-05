import React, { useState, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Spacer, Select, SelectItem, Tooltip, Link } from '@nextui-org/react';
import Papa from "papaparse";
import { createPosts } from '../../../utils/functionsAction.js';
import { PlusIcon } from '../../../Icon/PlusIcon';
import { CrossIcon } from '../../../Icon/CrossIcon';
import { DownloadIcon } from '../../../Icon/DownloadIcon';
import ExampleFilePosts from './example_file_posts.csv';

function ModalPosts({ posts, setPosts, open, setOpen, clusters }) {
	const [postsToCreate, setPostsToCreate] = useState([{Mac: "", Serial: "", Seat: "", ClusterID: 0}]);

	const [sending, setSending] = useState(false);

	const [errorFileMessage, setErrorFileMessage] = useState(null);
	const inputFileRef = useRef(null);
	const [filesUploaded, setFilesUploaded] = useState([]);

	function handleClickFile() {
		inputFileRef.current.click();
	}

	function handleFileChange(e) {
		const file = e.target.files && e.target.files[0]
		if (!file) { return }

		if (file.type !== "text/csv") { return }

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				const rowsArray = [];
				const valuesArray = [];

				// Check if the file has already been uploaded. Modal confimation ??
				if (filesUploaded.find((f) => f.name === file.name)) {
					setErrorFileMessage("This file has already been uploaded."); return;
				}

				let error = false;

				// Iterating data to get column name and their values
				results.data.forEach((d, i) => {
					if (error) { return; }

					rowsArray.push(Object.keys(d));
					valuesArray.push(Object.values(d));

					// If there is the good header
					if (!(rowsArray[i].length === 4
						&& rowsArray[i].find((r) => r.toLowerCase().includes("mac"))
						&& rowsArray[i].find((r) => r.toLowerCase().includes("serial"))
						&& rowsArray[i].find((r) => r.toLowerCase().includes("seat"))
						&& rowsArray[i].find((r) => r.toLowerCase().includes("cluster"))
					)) {
							error = true;
							return;
					}

					// Cluster name to corresponding id
					let cluster = clusters.find(c => { return d.Cluster.toLowerCase() === c.Name.toLowerCase() })
					if (cluster) {
						d.ClusterID = cluster.ID;
					} else {
						d.ClusterID = 0;
					}
					delete d.Cluster;
				});
					
				if (error) {
					setErrorFileMessage("An error occured in the file. Please check the example file.");
					return;
				}

				setPostsToCreate([...postsToCreate, ...results.data])

				setFilesUploaded([...filesUploaded, file])
				setErrorFileMessage(null);
			},
		});

		e.target.value = null;
	}

	function addPost() {
		setPostsToCreate([...postsToCreate, {Mac: "", Serial: "", Seat: "", ClusterID: 0}]);
	}

	function close() {
		setOpen(false);
	}

	function send() {
		// Send only if both element Mac and Serie are completed or empty
		if (postsToCreate.every((item) =>
			(item.Mac === "" && item.Serial === "") || (item.Mac !== "" && item.Serial !== "")
		)) {
			createPosts(postsToCreate, setPostsToCreate, posts, setPosts, setSending);
			return;
		}

		console.log("SOME PROBLEME");
	}

	return (
		<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="5xl"
			style={{ background:'#231f20', color: 'white', maxHeight: '70%' }}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<p>Want to create some <span style={{ color: '#01babc' }}>posts</span>?</p>
				</ModalHeader>

				<ModalBody>
					<div style={{ marginLeft: 'auto' }}>
						<input ref={inputFileRef} onChange={handleFileChange} accept=".csv" type="file" id="csv_posts"
							hidden />
						<Button onPress={handleClickFile}
							style={{ background: '#2ac974', color: 'white', width: '100px' }}
						>
							Upload CSV
						</Button>
						<Tooltip content="Exemple csv file">
							<Link href={ExampleFilePosts} download target="_blank" rel="noreferrer">
								<Button isIconOnly style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
									<DownloadIcon />
								</Button>
							</Link>
						</Tooltip>
					</div>

					{ errorFileMessage &&
						<p style={{ color: '#e96a64', marginLeft: 'auto' }}>{errorFileMessage}</p>
					}

					<table className="flex h-auto items-center"
						style={{ display: 'inline-block', maxHeight: '395px', overflow: 'auto', marginBottom: '1%' }}
					>
						<tbody>
							{[...Array(postsToCreate.length)].map((e, i) =>
								<RowPost key={i} index={i + 1} clusters={clusters} postsToCreate={postsToCreate}
									setPostsToCreate={setPostsToCreate} />
							)}
						</tbody>
					</table>
						
					<Button size="sm" radius="full" onPress={addPost}
						style={{ background: '#6e6e77', width: '50%', margin: 'auto', opacity: '0.5' }}
					>
						<PlusIcon />
					</Button>
				</ModalBody>

				<ModalFooter>
					<Button style={{ background: '#01babc', color: 'white' }} onPress={send} isLoading={sending}>
						Send
					</Button>
					<Button style={{ background: '#e96a64', color: 'white' }} onPress={close}>Close</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

function RowPost({ index, clusters, postsToCreate, setPostsToCreate }) {
	const item = postsToCreate[index - 1]

	function changeValue(val) {
		let newPostsToCreate = [...postsToCreate];
		newPostsToCreate[index - 1] = val;
		setPostsToCreate(newPostsToCreate);
	}

	return (
		<tr key={index}>
			<td>
				<span style={{ color: '#01babc' }}>{index}</span>
			</td>

			<td><Spacer x={7} /></td>

			<td>
				<div style={{ maxWidth: '300px' }}>
					<Input value={item.Mac} onValueChange={(v)=>{item.Mac = v; changeValue(item)}}
						label="MAC ADDRESS" variant="underlined" style={{ color: 'white' }} autoFocus/>
				</div>
			</td>

			<td><Spacer x={7} /></td>
			
			<td>
				<div style={{ maxWidth: '300px' }}>
					<Input value={item.Serial} onValueChange={(v)=>{item.Serial = v; changeValue(item)}}
						label="SERIAL NUMBER" variant="underlined" style={{ color: 'white' }} />
				</div>
			</td>

			<td><Spacer x={7} /></td>
			
			<td>
				<div style={{ maxWidth: '300px' }}>
					<Input value={item.Seat} onValueChange={(v)=>{item.Seat = v; changeValue(item)}}
						label="SEAT" variant="underlined" style={{ color: 'white' }} />
				</div>
			</td>

			<td><Spacer x={7} /></td>
			
			<td>
				<div style={{ width: '200px' }}>
					<Select selectedKeys={item.ClusterID !== 0 ? [item.ClusterID.toString()] : []} onSelectionChange={(v)=>{item.ClusterID = Number([...v][0]) | 0; changeValue(item)}}
						variant="underlined" size="sm" label="CLUSTER" color="white"
					>
						{ clusters.map((cluster) => (
							<SelectItem texteValue={cluster.Name} key={cluster.ID}>{cluster.Name}</SelectItem>
						))}
					</Select>
				</div>
			</td>

			<td><Spacer x={7} /></td>

			<td>
				<Button isIconOnly onPress={() => setPostsToCreate(postsToCreate.filter((_, i) => i !== index - 1))}
					style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}><CrossIcon /></Button>
			</td>

			<td><Spacer y={4}/></td>
		</tr>
	);
}

export default ModalPosts;
