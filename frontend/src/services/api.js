import axios from "axios";  

const UPLOADAPI = 'http://localhost:4000/api/file/upload'
const PROP = 'http://localhost:4000/api/properties'
const API = "http://localhost:4000/api/users";
const API1 = "http://localhost:4000/api/auth/login"
const FORGOT_PASSWORD_API = "http://localhost:4000/api/auth/forgot-password"
const RESET_PASSWORD_API = "http://localhost:4000/api/auth/reset-password"
const VERIFY_RESET_TOKEN_API = "http://localhost:4000/api/auth/verify-reset-token"
export const getLoggedIn = (data) => axios.post(API1, data); 
export const forgotPassword = (data) => axios.post(FORGOT_PASSWORD_API, data);
export const resetPassword = (data) => axios.post(RESET_PASSWORD_API, data);
export const verifyResetToken = (token) => axios.get(`${VERIFY_RESET_TOKEN_API}/${token}`); 
export const getUsers = () => axios.get(API);
export const getUsersById = (id) => axios.get(`${API}/${id}`);
export const createUser = (data) => axios.post(API, data);
export const updateUser = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API}/${id}`);
export const fetchProperties = () => {
  const token = localStorage.getItem('token');
  return axios.get(PROP, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchUserProperties = (userId) => {
  const token = localStorage.getItem('token');
  return axios.get(`${PROP}/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
export const upload = (data) => {
  const token = localStorage.getItem('token'); // or wherever you store your JWT
  return axios.post(PROP, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  return axios.get('http://localhost:4000/api/auth/init', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Update user profile image
export const updateProfileImage = (userId, imageFile) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('profileImage', imageFile);
  
  return axios.post(`http://localhost:4000/api/users/${userId}/profile-image`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Message API functions
const MESSAGE_API = 'http://localhost:4000/api/messages';

// Get all conversations for the current user
export const getConversations = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${MESSAGE_API}/conversations`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get messages for a specific conversation
export const getMessages = (conversationId, page = 1, limit = 50) => {
  const token = localStorage.getItem('token');
  return axios.get(`${MESSAGE_API}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Send a new message
export const sendMessage = (receiverId, content, messageType = 'text') => {
  const token = localStorage.getItem('token');
  return axios.post(`${MESSAGE_API}/send`, {
    receiverId,
    content,
    messageType
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Search users for starting new conversations
export const searchUsers = (query) => {
  const token = localStorage.getItem('token');
  return axios.get(`${MESSAGE_API}/search-users?query=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Start a new conversation
export const startConversation = (userId) => {
  const token = localStorage.getItem('token');
  return axios.post(`${MESSAGE_API}/start-conversation`, {
    userId
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Employee API functions
const EMPLOYEE_API = 'http://localhost:4000/api/employees';

// Create a new employee
export const createEmployee = (employeeData) => {
  const token = localStorage.getItem('token');
  return axios.post(EMPLOYEE_API, employeeData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get all employees for the current manager
export const getEmployees = () => {
  const token = localStorage.getItem('token');
  return axios.get(EMPLOYEE_API, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get employee by ID
export const getEmployeeById = (employeeId) => {
  const token = localStorage.getItem('token');
  return axios.get(`${EMPLOYEE_API}/${employeeId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Update employee
export const updateEmployee = (employeeId, employeeData) => {
  const token = localStorage.getItem('token');
  return axios.put(`${EMPLOYEE_API}/${employeeId}`, employeeData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Delete employee
export const deleteEmployee = (employeeId) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${EMPLOYEE_API}/${employeeId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Employee Authentication API
const EMPLOYEE_AUTH_API = 'http://localhost:4000/api/employee-auth';

// Employee login
export const employeeLogin = (credentials) => {
  return axios.post(`${EMPLOYEE_AUTH_API}/login`, credentials);
};

// Get current employee
export const getCurrentEmployee = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${EMPLOYEE_AUTH_API}/current`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get property details with rooms and maintenance records
export const getPropertyDetails = (propertyId) => {
  const token = localStorage.getItem('token');
  return axios.get(`${PROP}/${propertyId}/details`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};