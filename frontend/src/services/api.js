import axios from "axios";  

const UPLOADAPI = 'http://localhost:4000/api/file/upload'
const PROP = 'http://localhost:4000/api/properties'
const API = "http://localhost:4000/api/users";
const API1 = "http://localhost:4000/api/auth/login"
export const getLoggedIn = (data) => axios.post(API1, data); 
export const getUsers = () => axios.get(API);
export const getUsersById = (id) => axios.get(`${API}/${id}`);
export const createUser = (data) => axios.post(API, data);
export const updateUser = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API}/${id}`);
export const upload = (data) => {
  const token = localStorage.getItem('token'); // or wherever you store your JWT
  return axios.post(PROP, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};