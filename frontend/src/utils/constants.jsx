const API_URL = 'http://localhost:3000'

export const API_ROUTES = {
	ROOT: `${API_URL}`,
	LOGIN: 'auth/login',
	LOGOUT: 'auth/logout',
	GET_TICKET_TYPES: '/tickettypes',
	CREATE_TICKET: '/tickets',
}

export const APP_ROUTES = {
	HOME: '/',
	DASHBOARD: '/dashboard',
}
