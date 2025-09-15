import axios from 'axios';

// Prefer env-provided base URL (for Vercel), fallback to Render URL, then same-origin
const baseURL = process.env.REACT_APP_API_BASE || 'https://user-management-backend-4ihb.onrender.com' || '';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper wrappers
export const get = (url, config) => apiClient.get(url, config);
export const post = (url, data, config) => apiClient.post(url, data, config);
export const put = (url, data, config) => apiClient.put(url, data, config);
export const del = (url, config) => apiClient.delete(url, config);


