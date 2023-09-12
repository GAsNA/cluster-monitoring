import { API_ROUTES } from './constants';
import axios from "axios";

export const client = axios.create({
	baseURL: API_ROUTES.ROOT,
	timeout: 1000,
	headers: {
		'Content-Type': 'text/plain',
	}
});
