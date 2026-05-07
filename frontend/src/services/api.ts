import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Intercept requests to attach standard Google JWT Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get('/api/documents');
  return response.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const askQuestion = async (question: string) => {
  const response = await api.post('/api/ask', { question });
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/api/document/${id}`);
  return response.data;
};

export default api;
