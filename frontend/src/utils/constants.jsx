const API_URL = 'http://localhost:3000'

export const URL_INTRA_AUTHORIZE = 'https://api.intra.42.fr/oauth/authorize'
export const URL_INTRA_PROFILES = 'https://profile.intra.42.fr/users/'

export const API_ROUTES = {
	ROOT: `${API_URL}`,
	ME: 'auth/me',
	LOGIN: 'auth/login',
	LOGOUT: 'auth/logout',
	ANONYMISATION: 'auth/anonymisation',
	GET_TICKET_TYPES: '/tickettypes',
	CREATE_TICKET_TYPE: '/tickettypes',
	UPDATE_TICKET_TYPE: '/tickettypes/',
	DELETE_TICKET_TYPE: '/tickettypes/',
	GET_TICKETS: '/tickets',
	CREATE_TICKET: '/tickets',
	UPDATE_TICKET: '/tickets/',
	DELETE_TICKET: '/tickets/',
	GET_CLUSTERS: '/clusters',
	CREATE_CLUSTER: '/clusters',
	UPDATE_CLUSTER: '/clusters/',
	DELETE_CLUSTER: '/clusters/',
	GET_POSTS: '/posts',
	CREATE_POST: '/posts',
	UPDATE_POST: '/posts/',
	DELETE_POST: '/posts/',
}

export const APP_ROUTES = {
	HOME: '/',
	DASHBOARD: '/dashboard',
	ADMIN: '/admin',
}

