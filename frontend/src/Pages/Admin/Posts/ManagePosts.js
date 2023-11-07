import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { client } from '../../../utils/common.jsx';
import { API_ROUTES } from '../../../utils/constants.jsx';
import TicketPost from './TicketPost.js';
import ModalConfirmation from '../../../Components/ModalConfirmation.js';

function ManagePosts({ posts }) {
	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

	const [post, setPost] = useState();

	async function deletePost() {
		await client.delete(API_ROUTES.DELETE_POST + post.ID)
				.then((response) => {
					toast.success('Post deleted!');
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	}

	return (
		<>
			<div style={{ margin: '20px 0' }}>

				{ posts.map((item) => (
					<div key={item.ID}>
						<TicketPost post={item} setPost={setPost} setOpenModalConfirmation={setOpenModalConfirmation} />
					</div>
				))}

			</div>

			<ModalConfirmation open={openModalConfirmation} action={deletePost}
				text=<p><span style={{ color: '#01babc' }}>Are you sure</span> you want to delete this Post?
					<br/>This action is irreversible.
				</p>
				close={() => {setPost(); setOpenModalConfirmation(false)}}
			/>
		</>
	);
}

export default ManagePosts;
