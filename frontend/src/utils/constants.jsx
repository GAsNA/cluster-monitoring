const API_URL = 'http://localhost:3000'

export const URL_INTRA_AUTHORIZE = 'https://api.intra.42.fr/oauth/authorize'

export const API_ROUTES = {
	ROOT: `${API_URL}`,
	ME: 'auth/me',
	LOGIN: 'auth/login',
	LOGOUT: 'auth/logout',
	GET_TICKET_TYPES: '/tickettypes',
	CREATE_TICKET: '/tickets',
	GET_TICKETS_SEAT: '/tickets/seat/',
	GET_CLUSTERS: '/clusters',
}

export const APP_ROUTES = {
	HOME: '/',
	DASHBOARD: '/dashboard',
}

