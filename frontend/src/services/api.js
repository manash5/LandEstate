import axios from "axios";

const UPLOADAPI = 'http://localhost:4000/api/file/upload'
const PROP = 'http://localhost:4000/api/properties'
const API = "http://localhost:4000/api/users";
const API1 = "http://localhost:4000/api/auth/login"
const FORGOT_PASSWORD_API = "http://localhost:4000/api/auth/forgot-password"
const RESET_PASSWORD_API = "http://localhost:4000/api/auth/reset-password"
const VERIFY_RESET_TOKEN_API = "http://localhost:4000/api/auth/verify-reset-token"

// Create axios instance for user requests
const userAxios = axios.create();

// Create axios instance for employee requests  
const employeeAxios = axios.create();

// User token interceptor
userAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User response interceptor - redirect on 401/403
userAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to homepage
    }
    return Promise.reject(error);
  }
);

// Employee token interceptor
employeeAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('employeeToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Employee response interceptor - redirect on 401/403
employeeAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('employeeToken');
      window.location.href = '/employee/login'; // Redirect to employee login
    }
    return Promise.reject(error);
  }
);

// Check if user is authenticated (for route protection)
export const checkUserAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return false;
  }
  return true;
};

// Check if employee is authenticated (for route protection)
export const checkEmployeeAuth = () => {
  const token = localStorage.getItem('employeeToken');
  if (!token) {
    window.location.href = '/employee/login';
    return false;
  }
  return true;
};
// Public APIs (no auth required)
export const getLoggedIn = (data) => axios.post(API1, data); 
export const forgotPassword = (data) => axios.post(FORGOT_PASSWORD_API, data);
export const resetPassword = (data) => axios.post(RESET_PASSWORD_API, data);
export const verifyResetToken = (token) => axios.get(`${VERIFY_RESET_TOKEN_API}/${token}`); 
export const createUser = (data) => axios.post(API, data);

// User protected APIs (use userAxios)
export const getUsers = () => userAxios.get(API);
export const getUsersById = (id) => userAxios.get(`${API}/${id}`);
export const updateUser = (id, data) => userAxios.put(`${API}/${id}`, data);
export const deleteUser = (id) => userAxios.delete(`${API}/${id}`);
export const fetchProperties = () => userAxios.get(PROP);

export const fetchUserProperties = (userId) => userAxios.get(`${PROP}/user/${userId}`);

export const upload = (data) => {
  return userAxios.post(PROP, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getCurrentUser = () => {
  return userAxios.get('http://localhost:4000/api/auth/init');
};

// Update user profile image
export const updateProfileImage = (userId, imageFile) => {
  const formData = new FormData();
  formData.append('profileImage', imageFile);
  
  return userAxios.post(`http://localhost:4000/api/users/${userId}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Message API functions
const MESSAGE_API = 'http://localhost:4000/api/messages';

// Get all conversations for the current user
export const getConversations = () => {
  return userAxios.get(`${MESSAGE_API}/conversations`);
};

// Get messages for a specific conversation
export const getMessages = (conversationId, page = 1, limit = 50) => {
  return userAxios.get(`${MESSAGE_API}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
};

// Send a new message
export const sendMessage = (receiverId, content, messageType = 'text', userType = 'user') => {
  return userAxios.post(`${MESSAGE_API}/send`, {
    receiverId,
    content,
    messageType,
    userType
  });
};

// Search users for starting new conversations
export const searchUsers = (query) => {
  return userAxios.get(`${MESSAGE_API}/search-users?query=${encodeURIComponent(query)}`);
};

// Start a new conversation
export const startConversation = (userId, userType = 'user') => {
  return userAxios.post(`${MESSAGE_API}/start-conversation`, {
    userId,
    userType
  });
};

// Get total unread message count
export const getUnreadMessageCount = () => {
  return userAxios.get(`${MESSAGE_API}/unread-count`);
};

// Initialize conversations with all employees (admin only)
export const initializeEmployeeConversations = () => {
  return userAxios.post(`${MESSAGE_API}/initialize-employee-conversations`, {});
};

// Employee API functions
const EMPLOYEE_API = 'http://localhost:4000/api/employees/manage';

// Create a new employee
export const createEmployee = (employeeData) => {
  return userAxios.post(EMPLOYEE_API, employeeData);
};

// Get all employees for the current manager
export const getEmployees = () => {
  return userAxios.get(EMPLOYEE_API);
};

// Get employee by ID
export const getEmployeeById = (employeeId) => {
  return userAxios.get(`${EMPLOYEE_API}/${employeeId}`);
};

// Update employee
export const updateEmployee = (employeeId, employeeData) => {
  return userAxios.put(`${EMPLOYEE_API}/${employeeId}`, employeeData);
};

// Delete employee
export const deleteEmployee = (employeeId) => {
  return userAxios.delete(`${EMPLOYEE_API}/${employeeId}`);
};

// Employee Authentication API
const EMPLOYEE_AUTH_API = 'http://localhost:4000/api/employee-auth';

// Employee login
export const employeeLogin = (credentials) => {
  return axios.post(`${EMPLOYEE_AUTH_API}/login`, credentials);
};

// Get current employee
export const getCurrentEmployee = () => {
  return employeeAxios.get(`${EMPLOYEE_AUTH_API}/current`);
};

// Employee Dashboard API
const EMPLOYEE_DASHBOARD_API = 'http://localhost:4000/api/employees/dashboard';

// Get employee dashboard data
export const getEmployeeDashboard = () => {
  return employeeAxios.get(EMPLOYEE_DASHBOARD_API);
};

// Get assigned properties for employee
export const getEmployeeAssignedProperties = () => {
  return employeeAxios.get(`${EMPLOYEE_DASHBOARD_API}/properties`);
};

// Get maintenance records for employee's properties
export const getEmployeeMaintenanceRecords = () => {
  return employeeAxios.get(`${EMPLOYEE_DASHBOARD_API}/maintenance`);
};

// Create maintenance record for employee's property
export const createMaintenanceRecord = (maintenanceData) => {
  return employeeAxios.post(`${EMPLOYEE_DASHBOARD_API}/maintenance`, maintenanceData);
};

// Update maintenance record for employee's property
export const updateMaintenanceRecord = (maintenanceId, updateData) => {
  return employeeAxios.put(`${EMPLOYEE_DASHBOARD_API}/maintenance/${maintenanceId}`, updateData);
};

// Get property details with rooms and maintenance records
export const getPropertyDetails = (propertyId) => {
  return userAxios.get(`${PROP}/${propertyId}/details`);
};

// Update property
export const updateProperty = (propertyId, propertyData) => {
  return userAxios.patch(`${PROP}/${propertyId}`, propertyData);
};

// Transfer property ownership
export const transferPropertyOwnership = (propertyId, newOwnerName) => {
  return userAxios.patch(`${PROP}/${propertyId}/transfer`, { newOwnerName });
};

// Room management APIs (both user and employee can access)
export const createRoom = (propertyId, roomData) => {
  const userToken = localStorage.getItem('token');
  const employeeToken = localStorage.getItem('employeeToken');
  const axiosInstance = employeeToken ? employeeAxios : userAxios;
  return axiosInstance.post(`http://localhost:4000/api/rooms/property/${propertyId}/rooms`, roomData);
};

export const getRoomsByProperty = (propertyId) => {
  const userToken = localStorage.getItem('token');
  const employeeToken = localStorage.getItem('employeeToken');
  const axiosInstance = employeeToken ? employeeAxios : userAxios;
  return axiosInstance.get(`http://localhost:4000/api/rooms/property/${propertyId}/rooms`);
};

export const updateRoom = (roomId, roomData) => {
  const userToken = localStorage.getItem('token');
  const employeeToken = localStorage.getItem('employeeToken');
  const axiosInstance = employeeToken ? employeeAxios : userAxios;
  return axiosInstance.put(`http://localhost:4000/api/rooms/rooms/${roomId}`, roomData);
};

export const deleteRoom = (roomId) => {
  const userToken = localStorage.getItem('token');
  const employeeToken = localStorage.getItem('employeeToken');
  const axiosInstance = employeeToken ? employeeAxios : userAxios;
  return axiosInstance.delete(`http://localhost:4000/api/rooms/rooms/${roomId}`);
};

// Employee Message API functions
const EMPLOYEE_MESSAGE_API = 'http://localhost:4000/api/employee-messages';

// Get all conversations for the current employee
export const getEmployeeConversations = () => {
  return employeeAxios.get(`${EMPLOYEE_MESSAGE_API}/conversations`);
};

// Get messages for a specific conversation (employee)
export const getEmployeeMessages = (conversationId, page = 1, limit = 50) => {
  return employeeAxios.get(`${EMPLOYEE_MESSAGE_API}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
};

// Send a new message (employee to manager)
export const sendEmployeeMessage = (receiverId, content, messageType = 'text', userType = 'user') => {
  return employeeAxios.post(`${EMPLOYEE_MESSAGE_API}/send`, {
    receiverId,
    content,
    messageType,
    userType
  });
};

// Search managers for starting new conversations (employee)
export const searchEmployeeUsers = (query) => {
  return employeeAxios.get(`${EMPLOYEE_MESSAGE_API}/search-users?query=${encodeURIComponent(query)}`);
};

// Start a new conversation (employee with manager)
export const startEmployeeConversation = (userId, userType = 'user') => {
  return employeeAxios.post(`${EMPLOYEE_MESSAGE_API}/start-conversation`, {
    userId,
    userType
  });
};

// Get total unread message count (employee)
export const getEmployeeUnreadCount = () => {
  return employeeAxios.get(`${EMPLOYEE_MESSAGE_API}/unread-count`);
};

// Dashboard API functions
export const getUserDashboard = (userId, month = null, year = null) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  
  return userAxios.get(`${API}/${userId}/dashboard?${params}`);
};

export const getRevenueDetails = (userId, month = null, year = null) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  
  return userAxios.get(`${API}/${userId}/dashboard/revenue?${params}`);
};

export const getMaintenanceDetails = (userId, month = null, year = null, status = null) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  if (status) params.append('status', status);
  
  return userAxios.get(`${API}/${userId}/dashboard/maintenance?${params}`);
};

export const getOccupancyDetails = (userId) => {
  return userAxios.get(`${API}/${userId}/dashboard/occupancy`);
};