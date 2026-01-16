import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.31.48:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// Products
export const fetchAllProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data.data || [];
};

export const fetchProductById = async (productId: string) => {
  const response = await apiClient.get(`/products/${productId}`);
  return response.data.data || null;
};

// Orders
export const fetchAllOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data.data || [];
};

export const createOrder = async (orderData: any) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await apiClient.patch(`/orders/${orderId}/cancel`);
  return response.data;
};

export default apiClient;
