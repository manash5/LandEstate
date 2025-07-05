import axios from "axios";
 
const API = "http://localhost:4000/api/users";
const API1 = "http://localhost:4000/api/auth/login"
export const getLoggedIn = (data) => axios.post(API1, data); 
export const getUsers = () => axios.get(API);
export const getUsersById = (id) => axios.get(`${API}/${id}`);
export const createUser = (data) => axios.post(API, data);
export const updateUser = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API}/${id}`);