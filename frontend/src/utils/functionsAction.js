import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { client } from '../utils/common.jsx';
import { API_ROUTES, APP_ROUTES, URL_INTRA_AUTHORIZE } from '../utils/constants.jsx';

/* -------------- AUTH -------------- */
export async function login(staff) {
	window.location.replace(URL_INTRA_AUTHORIZE + "?client_id=" + process.env.REACT_APP_UID + "&redirect_uri=" + API_ROUTES.ROOT + "/" + API_ROUTES.LOGIN + "&response_type=code&scope=public&state=" + staff)
}

export async function localStoreMe() {
	await client.get(API_ROUTES.ME)
			.then((response) => {
				localStorage.setItem('user', JSON.stringify(response.data))
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

export async function logout() {
	await client.get(API_ROUTES.LOGOUT, "")
			.then((response) => {
				Cookies.remove("token")
				localStorage.clear();
				window.location.replace(APP_ROUTES.HOME);
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

export async function anonymisation() {
	await client.get(API_ROUTES.ANONYMISATION)
			.then((response) => {
				logout()
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

/* -------------- TICKETS -------------- */
export async function getTickets(seat, order, limit, page, author, resolved, type) {
	let data = [], totalPages = "";
	
		await client.get(API_ROUTES.GET_TICKETS + "?order=" + order +"&limit=" + limit + "&seat=" + seat +
			"&page=" + page + "&author=" + author + "&resolved=" + resolved + "&type=" + type)
				.then((response) => {
					data = response.data
					totalPages = response.headers['x-total-pages']
				})
				.catch((error) => {
					toast.error('An error occured');
				})
	return { 'data': data, 'totalPages': totalPages }
}

export async function createTicket(seat, cluster, ticketType, comment, setSending, closeModal) {
	setSending(true);
	await client.post(API_ROUTES.CREATE_TICKET, { "Seat": seat.id, "ClusterID": cluster.ID, "TypeID": parseInt([...ticketType][0]), "Comment": comment, })
			.then((response) => {
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
export async function getTicketTypes(setTicketTypes) {
	await client.get(API_ROUTES.GET_TICKET_TYPES)
			.then((response) => {
				setTicketTypes(response.data)
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

export async function createTicketType(name, ticketTypes, setSending, close) {
	setSending(true);
	await client.post(API_ROUTES.CREATE_TICKET_TYPE, { "Name": name })
			.then((response) => {
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
export async function getPosts(limit, page, setPosts, setIsLoading, setHasMore, setPage) {
	setIsLoading(true);

	await client.get(API_ROUTES.GET_POSTS + "?limit=" + limit + "&page=" + page)
			.then((response) => {
				if (response.data.length === 0) { setHasMore(false) }
				setPosts(prevItems => [...prevItems, ...response.data]);
				setPage(prevPage => prevPage + 1);
			})
			.catch((error) => {
				toast.error('An error occured');
			})

	setIsLoading(false);
}
export async function createPosts(postsToCreate, setPostsToCreate, posts, setPosts, setSending) {
	postsToCreate = postsToCreate.filter(p => p.Mac !== "" && p.Serial !== "")

	setSending(true);

	await Promise.all(postsToCreate.map(async (post) => {
		await client.post(API_ROUTES.CREATE_POST, post)
			.then((response) => {
				const newPost = response.data
				posts = [...posts, newPost];
				postsToCreate = postsToCreate.filter(p => p.Mac !== newPost.Mac && p.Serial !== newPost.Serial )
				toast.success('Post successfully created!');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
	}))

	setPosts(posts);
	setPostsToCreate(postsToCreate)
	
	setSending(false);
}

export async function modifyPost(post, posts, setPosts) {
	await client.put(API_ROUTES.UPDATE_POST + post.ID, post)
			.then((response) => {
				const newPost = response.data
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

export async function deletePost(post, posts, setPosts) {
	console.log("ID:", post.ID)
	console.log("POSTS:", posts)
	await client.delete(API_ROUTES.DELETE_POST + post.ID)
			.then((response) => {
				setPosts(posts.filter(function(p) { return p.ID !== post.ID }))
				toast.success('Post deleted!');
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

/* -------------- CLUSTERS -------------- */
export async function getClusters(setClusters) {
	await client.get(API_ROUTES.GET_CLUSTERS)
			.then((response) => {
				/*const clusters = response.data.map((item) => {
					let temp = {...item}
					temp.IsActive = false
					return temp
				});
				clusters[0].IsActive = true;

				setAllClusters(clusters);
				setCluster(clusters[0]);*/
				setClusters(response.data)
			})
			.catch((error) => {
				toast.error('An error occured');
			})
}

export async function createCluster(name, link, clusters, setSending, close) {
	setSending(true);
	await client.post(API_ROUTES.CREATE_CLUSTER, { "Name": name, "Link": link })
			.then((response) => {
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
