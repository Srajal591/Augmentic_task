import axios from 'axios';

const API_URL = 'http://192.168.31.48:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password, role = 'staff') => {
  const response = await apiClient.post('/auth/register', { name, email, password, role });
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// Users
export const fetchAllUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const createUser = async (userData) => {
  const response = await apiClient.post('/auth/create-user', userData);
  return response.data;
};

// Products
export const fetchAllProducts = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data.data || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Orders
export const fetchAllOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};
