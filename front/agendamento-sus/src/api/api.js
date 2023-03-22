import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const createFixedUser = () => {
	return axios.post(`${API_URL}/register`, {
		name: 'John Doe',
		email: 'jorgeallende333@gmail.com',
		password: 'jojin',
		c_password: 'jojin'
	});
};

export const login = (email, password) => {
	return axios.post(`${API_URL}/login`, { email, password });
};

export const getUnits = () => {
	return axios.get(`${API_URL}/units`);
};
