import axios from 'axios';

const API_URL = (
	process.env.REACT_APP_API_URL ||
	(process.env.NODE_ENV === 'development' ? 'http://localhost:8081/api' : '')
).replace(/\/$/, '');

const withApiUrl = (request) => {
	if (!API_URL) {
		return Promise.reject(new Error('The backend API URL is not configured for this deployment.'));
	}
	return request(API_URL);
};

export const getAllUsers = (credentials) => withApiUrl((url) => axios.get(`${url}/users`, { auth: credentials }));
export const createUser = (user) => withApiUrl((url) => axios.post(`${url}/users`, user));
export const getUserById = (id, credentials) => withApiUrl((url) => axios.get(`${url}/users/${id}`, { auth: credentials }));
export const updateUser = (id, user, credentials) => withApiUrl((url) => axios.put(`${url}/users/${id}`, user, { auth: credentials }));
export const deleteUser = (id, credentials) => withApiUrl((url) => axios.delete(`${url}/users/${id}`, { auth: credentials }));

export const getAllComplaints = (credentials) => withApiUrl((url) => axios.get(`${url}/complaints/getAll`, { auth: credentials }));
export const createComplaint = (complaint) => withApiUrl((url) => axios.post(`${url}/complaints/add`, complaint));
export const getComplaintById = (id, credentials) => withApiUrl((url) => axios.get(`${url}/complaints/${id}`, { auth: credentials }));
export const updateComplaint = (id, complaint, credentials) => withApiUrl((url) => axios.put(`${url}/complaints/${id}`, complaint, { auth: credentials }));
export const updateComplaintStatus = (id, status, credentials) => withApiUrl((url) => axios.patch(`${url}/complaints/${id}/status`, { status }, { auth: credentials }));
export const deleteComplaint = (id, credentials) => withApiUrl((url) => axios.delete(`${url}/complaints/${id}`, { auth: credentials }));
export const verifyAdmin = (credentials) => withApiUrl((url) => axios.get(`${url}/admin/session`, { auth: credentials }));