import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Spacer, Select, SelectItem } from '@nextui-org/react';
import { PlusIcon } from '../../../Icon/PlusIcon';
import { CrossIcon } from '../../../Icon/CrossIcon';

function ModalPosts({ open, setOpen, clusters }) {
	const [postsToCreate, setPostsToCreate] = useState([]);

	const [sending, setSending] = useState(false);

	const [nbPosts, setNbPosts] = useState(1);

	function close() {
		setOpen(false);
	}

	function send() {
		// if one of the element have mac or serial empty, return
		
		// send
	}

	return (
		<>
			<Modal isOpen={open} onClose={close} placement="center" backdrop="opaque" size="5xl" style={{ background:'#231f20', color: 'white', maxHeight: '70%' }}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<p>Want to create some <span style={{ color: '#01babc' }}>posts</span>?</p>
					</ModalHeader>

					<ModalBody>
						<div className="flex h-auto items-center" style={{ display: 'inline-block', maxHeight: '415px', overflow: 'auto', marginBottom: '1%' }}>
							{[...Array(nbPosts)].map((e, i) =>
								<>
									<RowPost index={i + 1} clusters={clusters} />
									<Spacer y={4}/>
								</>
							)}
						</div>
						
						<Button size="sm" radius="full" onPress={() => setNbPosts(nbPosts + 1)}
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
		</>
	);
}

function RowPost({ index, clusters }) {
	return (
		<tr>
			<td>
				<span style={{ color: '#01babc' }}>{index}</span>
			</td>

			<Spacer x={7} />

			<td>
				<div style={{ maxWidth: '300px' }}>
					<Input label="MAC ADDRESS" variant="underlined" style={{ color: 'white' }} autoFocus/>
				</div>
			</td>

			<Spacer x={7} />
			
			<td>
				<div style={{ maxWidth: '300px' }}>
					<Input label="SERIAL NUMBER" variant="underlined" style={{ color: 'white' }} />
				</div>
			</td>

			<Spacer x={7} />
			
			<td>
				<div style={{ maxWidth: '300px' }}>
					<Input label="SEAT" variant="underlined" style={{ color: 'white' }} />
				</div>
			</td>

			<Spacer x={7} />
			
			<td>
				<div style={{ width: '200px' }}>
					<Select variant="underlined" size="sm" label="CLUSTERS">
						{ clusters.map((cluster) => (
							<SelectItem texteValue={cluster.Name} key={cluster.ID}>{cluster.Name}</SelectItem>
						))}
					</Select>
				</div>
			</td>

			<Spacer x={7} />

			<td>
				<Button isIconOnly style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}><CrossIcon /></Button>
			</td>
		</tr>
	);
}

export default ModalPosts;
