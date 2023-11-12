import { toast } from 'react-hot-toast';
import { client } from '../utils/common.jsx';
import { API_ROUTES } from '../utils/constants.jsx';

/* -------------- TICKETS -------------- */
export async function createTicket(seat, cluster, ticketType, comment, setSending, closeModal) {
	setSending(true);
	await client.post(API_ROUTES.CREATE_TICKET, { "Seat": seat.id, "ClusterID": cluster.ID, "TypeID": parseInt([...ticketType][0]), "Comment": comment, })
			.then((response) => {
				console.log(response.data);
				toast.success('Ticket successfully sent');
			})
			.catch((error) => {
				toast.error('An error occured');
			});

	setSending(false);
	closeModal();
}

export async function changeStatusTicket(ticket, tickets, setTickets) {
	await client.put(API_ROUTES.UPDATE_TICKET + ticket.ID, { "Resolved": !ticket.Resolved })
			.then((response) => {
				const newTicket = response.data
				console.log(newTicket)
				const newTickets = tickets.map((t) => {
					if (t.ID === newTicket.ID) {
						t.Resolved = newTicket.Resolved;
						t.ResolvedAt = newTicket.ResolvedAt;
						t.ResolvedByID = newTicket.ResolvedByID;
					}
					return t;
				});
				setTickets(newTickets);
				toast.success('Ticket status changed!');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

export async function deleteTicket(ticket, tickets, setTickets) {
	await client.delete(API_ROUTES.DELETE_TICKET + ticket.ID)
		.then((response) => {
			setTickets(tickets.filter(function(t) { return t.ID !== ticket.ID }))
			toast.success('Ticket deleted!');
		})
		.catch((error) => {
			toast.error('An error occured');
		})
}

/* -------------- TICKET TYPES -------------- */
export async function createTicketType(name, ticketTypes, setSending, close) {
	setSending(true);
	await client.post(API_ROUTES.CREATE_TICKET_TYPE, { "Name": name })
			.then((response) => {
				console.log(response.data)
				ticketTypes.push(response.data)
				toast.success('Ticket type successfully created');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
	setSending(false);
	close();
}

export async function modifyTicketType(ticketType, name, ticketTypes, setTicketTypes, setSending, close) {
	setSending(true);
	await client.put(API_ROUTES.UPDATE_TICKET_TYPE + ticketType.ID, { "Name": name })
			.then((response) => {
				const newTicketType = response.data
				console.log(newTicketType)
				const newTicketTypes = ticketTypes.map((tt) => {
					if (tt.ID === newTicketType.ID) {
						tt.Name = newTicketType.Name;
					}
					return tt;
				});
				setTicketTypes(newTicketTypes);
				toast.success('Ticket type successfully updated');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
	setSending(false);
	close();
}

export async function deleteTicketType(ticketType, ticketTypes, setTicketTypes) {
	await client.delete(API_ROUTES.DELETE_TICKET_TYPE + ticketType.ID)
			.then((response) => {
				setTicketTypes(ticketTypes.filter(function(tt) { return tt.ID !== ticketType.ID }))
				toast.success('Ticket type deleted!');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

/* -------------- POSTS -------------- */
export async function modifyPost(post, newPosts, posts, setPosts) {
	await client.put(API_ROUTES.UPDATE_POST + post.ID, newPosts.find((p) => { return p.ID === post.ID }))
			.then((response) => {
				const newPost = response.data
				console.log(newPost)
				const newAllPosts = posts.map((p) => {
					if (p.ID === newPost.ID) {return newPost;}
					return p;
				});
				setPosts(newAllPosts);
				toast.success('Post successfully updated');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

export async function deletePost(post, postsModified, setPostsModified, posts, setPosts) {
	await client.delete(API_ROUTES.DELETE_POST + post.ID)
			.then((response) => {
				setPosts(posts.filter(function(p) { return p.ID !== post.ID }))
				setPostsModified(postsModified.filter(function(p) { return p.ID !== post.ID }))
				toast.success('Post deleted!');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

/* -------------- CLUSTERS -------------- */
export async function createCluster(name, link, clusters, setSending, close) {
	setSending(true);
	await client.post(API_ROUTES.CREATE_CLUSTER, { "Name": name, "Link": link })
			.then((response) => {
				console.log(response.data)
				clusters.push(response.data)
				toast.success('Cluster successfully created');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
	setSending(false);
	close();
}

export async function modifyCluster(cluster, name, link, clusters, setClusters, setSending, close) {
	setSending(true);
	await client.put(API_ROUTES.UPDATE_CLUSTER + cluster.ID, { "Name": name, "Link": link })
			.then((response) => {
				const newCluster = response.data
				console.log(newCluster)
				const newClusters = clusters.map((c) => {
					if (c.ID === newCluster.ID) {
						c.Name = newCluster.Name;
						c.Link = newCluster.Link;
					}
					return c;
				});
				setClusters(newClusters);
				toast.success('Cluster successfully updated');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
	setSending(false);
	close();
}

export async function deleteCluster(cluster, clusters, setClusters) {
	await client.delete(API_ROUTES.DELETE_CLUSTER + cluster.ID)
			.then((response) => {
				setClusters(clusters.filter(function(c) { return c.ID !== cluster.ID }))
				toast.success('Cluster deleted!');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}
