import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an Axios instance to automatically add the Token
const api = axios.create({
  baseURL: API_URL
});

// Interceptor: Check localStorage for token before sending request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Data APIs (Now using the 'api' instance instead of 'axios')
export const getEmployees = () => api.get('/employees');
export const createEmployee = (data) => api.post('/employees', data);
export const getTasks = (status) => {
    const url = status ? `/tasks?status=${status}` : '/tasks';
    return api.get(url);
};
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const getDashboardStats = () => api.get('/dashboard');

// Add to the bottom of src/services/api.js
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export default api;
