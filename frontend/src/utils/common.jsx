import { API_ROUTES } from './constants';
import axios from "axios";
import Cookies from 'js-cookie';

export const client = axios.create({
	baseURL: API_ROUTES.ROOT,
	timeout: 1000,
	headers: {
		Authorization: `Bearer ${Cookies.get("token")}`,
	}
});
