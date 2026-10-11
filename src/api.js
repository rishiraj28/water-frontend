import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

export const getAllUsers = (credentials) => axios.get(`${API_URL}/users`, { auth: credentials });
export const createUser = (user) => axios.post(`${API_URL}/users`, user);
export const getUserById = (id, credentials) => axios.get(`${API_URL}/users/${id}`, { auth: credentials });
export const updateUser = (id, user, credentials) => axios.put(`${API_URL}/users/${id}`, user, { auth: credentials });
export const deleteUser = (id, credentials) => axios.delete(`${API_URL}/users/${id}`, { auth: credentials });

export const getAllComplaints = (credentials) => axios.get(`${API_URL}/complaints/getAll`, { auth: credentials });
export const createComplaint = (complaint) => axios.post(`${API_URL}/complaints/add`, complaint);
export const getComplaintById = (id, credentials) => axios.get(`${API_URL}/complaints/${id}`, { auth: credentials });
export const updateComplaint = (id, complaint, credentials) => axios.put(`${API_URL}/complaints/${id}`, complaint, { auth: credentials });
export const updateComplaintStatus = (id, status, credentials) => axios.patch(`${API_URL}/complaints/${id}/status`, { status }, { auth: credentials });
export const deleteComplaint = (id, credentials) => axios.delete(`${API_URL}/complaints/${id}`, { auth: credentials });
export const verifyAdmin = (credentials) => axios.get(`${API_URL}/admin/session`, { auth: credentials });