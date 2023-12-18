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
export async function getTickets(order, limit, page, seat, author, resolved, type) {
	let data = [], actualPage = "", perPage = "", totalCount = "", totalPages = "", err = null;
	
	await client.get(API_ROUTES.GET_TICKETS + "?order=" + order +"&limit=" + limit + "&seat=" + seat +
		"&page=" + page + "&author=" + author + "&resolved=" + resolved + "&type=" + type)
			.then((response) => {
				data = response.data
				actualPage = response.headers['x-page']
				perPage = response.headers['x-per-page']
				totalCount = response.headers['x-total-count']
				totalPages = response.headers['x-total-pages']
			})
			.catch((error) => {
				err = error
				toast.error('An error occured');
			})

	return { 'data': data,
			'page': actualPage,
			'perPage': perPage,
			'totalCount': totalCount,
			'totalPages': totalPages,
			'err': err }
}

export async function createTicket(ticket) {
	let data = {}, err = null;

	await client.post(API_ROUTES.CREATE_TICKET, ticket)
			.then((response) => {
				data = response.data;
				toast.success('Ticket successfully sent');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			});

	return { 'data': data,
			'err': err }
}

export async function updateTicket(ticket) {
	let data = {}, err = null;

	await client.put(API_ROUTES.UPDATE_TICKET + ticket.ID, ticket)
			.then((response) => {
				data = response.data;
				toast.success('Ticket successfully updated!');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})
	
	return { 'data': data,
			'err': err }
}

export async function deleteTicket(ticket) {
	let err = null;

	await client.delete(API_ROUTES.DELETE_TICKET + ticket.ID)
		.then((response) => {
			toast.success('Ticket deleted!');
		})
		.catch((error) => {
			err = error;
			toast.error('An error occured');
		})

	return { 'err': err }
}

/* -------------- TICKET TYPES -------------- */
export async function getTicketTypes(order, limit, page) {
	let data = [], actualPage = "", perPage = "", totalCount = "", totalPages = "", err = null;
	
	await client.get(API_ROUTES.GET_TICKET_TYPES + "?order=" + order + "&limit=" + limit + "&page=" + page)
			.then((response) => {
				//setTicketTypes(response.data)
				data = response.data
				actualPage = response.headers['x-page']
				perPage = response.headers['x-per-page']
				totalCount = response.headers['x-total-count']
				totalPages = response.headers['x-total-pages']
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})

	return { 'data': data,
			'page': actualPage,
			'perPage': perPage,
			'totalCount': totalCount,
			'totalPages': totalPages,
			'err': err }
}

export async function createTicketType(ticketType) {
	let data = {}, err = null;

	await client.post(API_ROUTES.CREATE_TICKET_TYPE, ticketType)
			.then((response) => {
				data = response.data;
				toast.success('Ticket type successfully created');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})

	return { 'data': data,
			'err': err }
}

export async function updateTicketType(ticketType) {
	let data = {}, err = null;

	await client.put(API_ROUTES.UPDATE_TICKET_TYPE + ticketType.ID, ticketType)
			.then((response) => {
				data = response.data;
				toast.success('Ticket type successfully updated');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})

	return { 'data': data,
			'err': err }
}

export async function deleteTicketType(ticketType) {
	let err = null;

	await client.delete(API_ROUTES.DELETE_TICKET_TYPE + ticketType.ID)
			.then((response) => {
				toast.success('Ticket type deleted!');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})

	return { 'err': err }
}

/* -------------- POSTS -------------- */
export async function getPosts(order, limit, page, mac, serial) {
	let data = [], actualPage = "", perPage = "", totalCount = "", totalPages = "", err = null;

	await client.get(API_ROUTES.GET_POSTS + "?order=" + order + "&limit=" + limit + "&page=" + page +
		"&mac=" + mac + "&serial=" + serial)
			.then((response) => {
				data = response.data
				actualPage = response.headers['x-page']
				perPage = response.headers['x-per-page']
				totalCount = response.headers['x-total-count']
				totalPages = response.headers['x-total-pages']
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})

	return { 'data': data,
			'page': actualPage,
			'perPage': perPage,
			'totalCount': totalCount,
			'totalPages': totalPages,
			'err': err }
}

export async function createPosts(posts, setPostsToCreate) {
	let data = [], err = null;

	await Promise.all(posts.map(async (post) => {
		await client.post(API_ROUTES.CREATE_POST, post)
			.then((response) => {
				const newPost = response.data
				posts = posts.filter(p => p.Mac !== newPost.Mac && p.Serial !== newPost.Serial)
				data = [...data, response.data]
				toast.success('Post successfully created!');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})
	}))

	setPostsToCreate(posts)
	
	return { 'data': data,
			'err': err }
}

export async function updatePost(post) {
	let data = {}, err = null;

	await client.put(API_ROUTES.UPDATE_POST + post.ID, post)
			.then((response) => {
				data = response.data;
				toast.success('Post successfully updated');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})

	return { 'data': data,
			'err': err }
}

export async function deletePost(post) {
	let err = null;

	await client.delete(API_ROUTES.DELETE_POST + post.ID)
			.then((response) => {
				toast.success('Post deleted!');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})
	
	return { 'err': err }
}

/* -------------- CLUSTERS -------------- */
export async function getClusters(order, limit, page) {
	let data = [], actualPage = "", perPage = "", totalCount = "", totalPages = "", err = null;

	await client.get(API_ROUTES.GET_CLUSTERS + "?order=" + order + "&limit=" + limit + "&page=" + page)
			.then((response) => {
				data = response.data
				actualPage = response.headers['x-page']
				perPage = response.headers['x-per-page']
				totalCount = response.headers['x-total-count']
				totalPages = response.headers['x-total-pages']
			})
			.catch((error) => {
				toast.error('An error occured');
			})

	return { 'data': data,
			'page': actualPage,
			'perPage': perPage,
			'totalCount': totalCount,
			'totalPages': totalPages,
			'err': err }
}

export async function createCluster(cluster) {
	let data = {}, err = null;

	await client.post(API_ROUTES.CREATE_CLUSTER, cluster)
			.then((response) => {
				data = response.data;
				toast.success('Cluster successfully created');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})
	
	return { 'data': data,
			'err': err }
}

export async function updateCluster(cluster) {
	let data = {}, err = null;

	await client.put(API_ROUTES.UPDATE_CLUSTER + cluster.ID, cluster)
			.then((response) => {
				data = response.data;
				toast.success('Cluster successfully updated');
			})
			.catch((error) => {
				err = error;
				toast.error('An error occured');
			})

	return { 'data': data,
			'err': err }
}

export async function deleteCluster(cluster) {
	let err = null

	await client.delete(API_ROUTES.DELETE_CLUSTER + cluster.ID)
			.then((response) => {
				toast.success('Cluster deleted!');
			})
			.catch((error) => {
				err = error
				toast.error('An error occured');
			})

	return { 'err': err }
}
