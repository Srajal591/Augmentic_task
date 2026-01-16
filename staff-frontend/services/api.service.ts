import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api.config';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.API_URL,
      timeout: API_CONFIG.TIMEOUT,
    });
  }

  // Product Service
  async getAllProducts() {
    try {
      const response = await this.axiosInstance.get('/products');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  async getProductById(productId: string) {
    try {
      const response = await this.axiosInstance.get(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  // Order Service
  async placeOrder(productId: string, quantity: number, staffName: string) {
    try {
      const response = await this.axiosInstance.post('/orders', {
        productId,
        quantity,
        staffName,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  async getAllOrders() {
    try {
      const response = await this.axiosInstance.get('/orders');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  async getOrderById(orderId: string) {
    try {
      const response = await this.axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
}

export default new ApiService();
