import { Platform } from 'react-native';

/**
 * API Configuration
 * Using IP: 192.168.31.48
 */

const BASE_URL = 'http://192.168.31.48:5000';

export const API_CONFIG = {
  BASE_URL: BASE_URL,
  API_URL: `${BASE_URL}/api`,
  SOCKET_URL: BASE_URL,
  TIMEOUT: 10000,
};

// Log the configuration for debugging
console.log('API Configuration:', {
  Platform: Platform.OS,
  BASE_URL: API_CONFIG.BASE_URL,
  API_URL: API_CONFIG.API_URL,
  SOCKET_URL: API_CONFIG.SOCKET_URL,
});
