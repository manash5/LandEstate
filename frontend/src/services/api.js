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
export const sendMessage = (receiverId, content, messageType = 'text', userType = 'user') => {
  const token = localStorage.getItem('token');
  return axios.post(`${MESSAGE_API}/send`, {
    receiverId,
    content,
    messageType,
    userType
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
export const startConversation = (userId, userType = 'user') => {
  const token = localStorage.getItem('token');
  return axios.post(`${MESSAGE_API}/start-conversation`, {
    userId,
    userType
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get total unread message count
export const getUnreadMessageCount = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${MESSAGE_API}/unread-count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Initialize conversations with all employees (admin only)
export const initializeEmployeeConversations = () => {
  const token = localStorage.getItem('token');
  return axios.post(`${MESSAGE_API}/initialize-employee-conversations`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Employee API functions
const EMPLOYEE_API = 'http://localhost:4000/api/employees/manage';

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
  const token = localStorage.getItem('employeeToken');
  return axios.get(`${EMPLOYEE_AUTH_API}/current`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Employee Dashboard API
const EMPLOYEE_DASHBOARD_API = 'http://localhost:4000/api/employees/dashboard';

// Get employee dashboard data
export const getEmployeeDashboard = () => {
  const token = localStorage.getItem('employeeToken');
  return axios.get(EMPLOYEE_DASHBOARD_API, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get assigned properties for employee
export const getEmployeeAssignedProperties = () => {
  const token = localStorage.getItem('employeeToken');
  return axios.get(`${EMPLOYEE_DASHBOARD_API}/properties`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get maintenance records for employee's properties
export const getEmployeeMaintenanceRecords = () => {
  const token = localStorage.getItem('employeeToken');
  return axios.get(`${EMPLOYEE_DASHBOARD_API}/maintenance`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Create maintenance record for employee's property
export const createMaintenanceRecord = (maintenanceData) => {
  const token = localStorage.getItem('employeeToken');
  return axios.post(`${EMPLOYEE_DASHBOARD_API}/maintenance`, maintenanceData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Update maintenance record for employee's property
export const updateMaintenanceRecord = (maintenanceId, updateData) => {
  const token = localStorage.getItem('employeeToken');
  return axios.put(`${EMPLOYEE_DASHBOARD_API}/maintenance/${maintenanceId}`, updateData, {
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

// Update property
export const updateProperty = (propertyId, propertyData) => {
  const token = localStorage.getItem('token');
  return axios.patch(`${PROP}/${propertyId}`, propertyData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Transfer property ownership
export const transferPropertyOwnership = (propertyId, newOwnerName) => {
  const token = localStorage.getItem('token');
  return axios.patch(`${PROP}/${propertyId}/transfer`, { newOwnerName }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Room management APIs
export const createRoom = (propertyId, roomData) => {
  const token = localStorage.getItem('employeeToken') || localStorage.getItem('token');
  return axios.post(`http://localhost:4000/api/rooms/property/${propertyId}/rooms`, roomData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getRoomsByProperty = (propertyId) => {
  const token = localStorage.getItem('employeeToken') || localStorage.getItem('token');
  return axios.get(`http://localhost:4000/api/rooms/property/${propertyId}/rooms`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const updateRoom = (roomId, roomData) => {
  const token = localStorage.getItem('employeeToken') || localStorage.getItem('token');
  return axios.put(`http://localhost:4000/api/rooms/rooms/${roomId}`, roomData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const deleteRoom = (roomId) => {
  const token = localStorage.getItem('employeeToken') || localStorage.getItem('token');
  return axios.delete(`http://localhost:4000/api/rooms/rooms/${roomId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Employee Message API functions
const EMPLOYEE_MESSAGE_API = 'http://localhost:4000/api/employee-messages';

// Get all conversations for the current employee
export const getEmployeeConversations = () => {
  const token = localStorage.getItem('employeeToken');
  return axios.get(`${EMPLOYEE_MESSAGE_API}/conversations`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get messages for a specific conversation (employee)
export const getEmployeeMessages = (conversationId, page = 1, limit = 50) => {
  const token = localStorage.getItem('employeeToken');
  return axios.get(`${EMPLOYEE_MESSAGE_API}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Send a new message (employee to manager)
export const sendEmployeeMessage = (receiverId, content, messageType = 'text', userType = 'user') => {
  const token = localStorage.getItem('employeeToken');
  return axios.post(`${EMPLOYEE_MESSAGE_API}/send`, {
    receiverId,
    content,
    messageType,
    userType
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Search managers for starting new conversations (employee)
export const searchEmployeeUsers = (query) => {
  const token = localStorage.getItem('employeeToken');
  return axios.get(`${EMPLOYEE_MESSAGE_API}/search-users?query=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Start a new conversation (employee with manager)
export const startEmployeeConversation = (userId, userType = 'user') => {
  const token = localStorage.getItem('employeeToken');
  return axios.post(`${EMPLOYEE_MESSAGE_API}/start-conversation`, {
    userId,
    userType
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get total unread message count (employee)
export const getEmployeeUnreadCount = () => {
  const token = localStorage.getItem('employeeToken');
  return axios.get(`${EMPLOYEE_MESSAGE_API}/unread-count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Dashboard API functions
export const getUserDashboard = (userId, month = null, year = null) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  
  return axios.get(`${API}/${userId}/dashboard?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getRevenueDetails = (userId, month = null, year = null) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  
  return axios.get(`${API}/${userId}/dashboard/revenue?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getMaintenanceDetails = (userId, month = null, year = null, status = null) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  if (status) params.append('status', status);
  
  return axios.get(`${API}/${userId}/dashboard/maintenance?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getOccupancyDetails = (userId) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API}/${userId}/dashboard/occupancy`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};